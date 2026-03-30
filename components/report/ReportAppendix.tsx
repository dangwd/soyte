import React from 'react';
import { FeedbackItem } from '@/types/feedbacks';
import { useFacilities } from '@/hooks/useFacilities';
import { getReportedFacilityId, getExpectedFacilities } from '@/utils/reportDataUtils';

interface ReportAppendixProps {
    groupedFeedbacks: Record<string, { title: string, items: FeedbackItem[] }>;
    formTemplates?: Record<string, any>;
    type?: 'DCBC' | 'TCT01';
}

export const ReportAppendix: React.FC<ReportAppendixProps> = ({ groupedFeedbacks, formTemplates, type = 'DCBC' }) => {
    const { facilities } = useFacilities();

    const getAppendixData = () => {
        const sortedEntries = (Object.entries(groupedFeedbacks) as [string, { title: string, items: FeedbackItem[] }][]).sort((a, b) => {
            const order: Record<string, number> = { "3": 1, "17": 2, "18": 3 };
            return (order[a[0]] || 99) - (order[b[0]] || 99);
        });

        if (type === 'TCT01') {
            return {
                app1Title: "PHỤ LỤC 1",
                app1Sub: "Danh mục các đơn vị đã thực hiện báo cáo trong kỳ",
                app1Items: sortedEntries.map(([formId, group]) => ({
                    title: group.title,
                    units: group.items.map(item => ({ id: item.id, name: getReportedFacilityName(item, facilities) }))
                })), // Keep all categories
                app2Title: null,
                app2Sub: null,
                app2Items: []
            };
        } else {
            const app1Groups = sortedEntries.map(([formId, group]) => {
                const template = formTemplates?.[formId];
                if (!template) return { title: group.title, units: [] };
                const expected = getExpectedFacilities(template, facilities);
                const reportedIds = new Set(group.items.map(fb => getReportedFacilityId(fb, facilities)));
                const nonReported = expected.filter(exp => !reportedIds.has(exp.id));
                return { title: group.title, units: nonReported };
            });

            const app2Groups = sortedEntries.map(([formId, group]) => {
                const template = formTemplates?.[formId];
                if (!template) return { title: group.title, units: [] };
                const lateUnits = group.items.filter(item => {
                    if (!template.endDate) return false;
                    return new Date(item.createdAt) > new Date(template.endDate);
                }).map(item => ({ id: item.id, name: getReportedFacilityName(item, facilities) }));
                
                const uniqueLate = Array.from(new Map(lateUnits.map(u => [u.name, u])).values());
                return { title: group.title, units: uniqueLate };
            });

            return {
                app1Title: "PHỤ LỤC 1",
                app1Sub: "Danh mục các đơn vị CHƯA thực hiện báo cáo trong kỳ",
                app1Items: app1Groups,
                app2Title: "PHỤ LỤC 2",
                app2Sub: "Danh mục các đơn vị thực hiện báo cáo KHÔNG đúng hạn",
                app2Items: app2Groups
            };
        }
    };

    const getReportedFacilityName = (item: FeedbackItem, facilities: any[]) => {
        const id = getReportedFacilityId(item, facilities);
        const facility = (facilities || []).find(f => String(f.id) === String(id));
        if (facility) return facility.name;
        if (item.info) {
            const firstMatchedField = Object.entries(item.info)
                .filter(([k]) => !isNaN(Number(k)))
                .find(([_, v]: [string, any]) => v?.value?.key && v?.value?.value);
            if (firstMatchedField) return String((firstMatchedField[1] as any).value.value);
        }
        return item.fullName || item.name || `Đơn vị (${id || '?'})`;
    };

    const { app1Title, app1Sub, app1Items, app2Title, app2Sub, app2Items } = getAppendixData();
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

    return (
        <div className="space-y-10 mt-10">
            {/* Appendix 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-5 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg uppercase tracking-tight">{app1Title}</h3>
                        <p className="text-sm text-slate-500 mt-0.5 italic">{app1Sub}</p>
                    </div>
                </div>

                <div className="p-6 md:p-8 overflow-x-auto bg-slate-50/10">
                    <table className="w-full border-collapse border border-slate-400 bg-white">
                        <thead className="bg-primary-900 text-white">
                            <tr>
                                <th className="border border-slate-500 p-4 text-center font-bold w-24 uppercase text-xs tracking-widest">STT</th>
                                <th className="border border-slate-500 p-4 text-left font-bold uppercase text-xs tracking-widest">Tên đơn vị</th>
                            </tr>
                        </thead>
                        <tbody>
                            {app1Items.map((group, gi) => (
                                <React.Fragment key={`app1-${gi}`}>
                                    <tr className="bg-slate-100/80 border-b border-slate-400">
                                        <td className="border border-slate-400 p-4 text-center font-black text-primary-900">
                                            {roman[gi] || gi + 1}
                                        </td>
                                        <td className="border border-slate-400 p-4 text-left font-bold text-primary-900 italic text-sm tracking-tight">
                                            {group.title}
                                        </td>
                                    </tr>
                                    {group.units.length > 0 ? (
                                        group.units.map((unit: any, ii: number) => (
                                            <tr key={`app1-${gi}-${ii}`} className="border-b border-slate-400 hover:bg-slate-50 transition-colors">
                                                <td className="border border-slate-400 p-4 text-center text-slate-700 font-medium">
                                                    {ii + 1}
                                                </td>
                                                <td className="border border-slate-400 p-4 text-left text-slate-800 font-semibold">
                                                    {unit.name}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-b border-slate-400 italic text-slate-400">
                                            <td className="border border-slate-400 p-4 text-center">-</td>
                                            <td className="border border-slate-400 p-4 text-left">(Không có dữ liệu)</td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Appendix 2 */}
            {app2Title && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-5 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg uppercase tracking-tight">{app2Title}</h3>
                            <p className="text-sm text-slate-500 mt-0.5 italic">{app2Sub}</p>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 overflow-x-auto bg-slate-50/10">
                        <table className="w-full border-collapse border border-slate-400 bg-white">
                            <thead className="bg-primary-900 text-white">
                                <tr>
                                    <th className="border border-slate-500 p-4 text-center font-bold w-24 uppercase text-xs tracking-widest">STT</th>
                                    <th className="border border-slate-500 p-4 text-left font-bold uppercase text-xs tracking-widest">Tên đơn vị</th>
                                </tr>
                            </thead>
                            <tbody>
                                {app2Items.map((group, gi) => (
                                    <React.Fragment key={`app2-${gi}`}>
                                        <tr className="bg-slate-100/80 border-b border-slate-400">
                                            <td className="border border-slate-400 p-4 text-center font-black text-primary-900">
                                                {roman[gi] || gi + 1}
                                            </td>
                                            <td className="border border-slate-400 p-4 text-left font-bold text-primary-900 italic text-sm tracking-tight">
                                                {group.title}
                                            </td>
                                        </tr>
                                        {group.units.length > 0 ? (
                                            group.units.map((unit: any, ii: number) => (
                                                <tr key={`app2-${gi}-${ii}`} className="border-b border-slate-400 hover:bg-slate-50 transition-colors">
                                                    <td className="border border-slate-400 p-4 text-center text-slate-700 font-medium">
                                                        {ii + 1}
                                                    </td>
                                                    <td className="border border-slate-400 p-4 text-left text-slate-800 font-semibold">
                                                        {unit.name}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="border-b border-slate-400 italic text-slate-400">
                                                <td className="border border-slate-400 p-4 text-center">-</td>
                                                <td className="border border-slate-400 p-4 text-left">(Không có dữ liệu)</td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
