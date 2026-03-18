import AdminLayout from '@/components/AdminLayout'
import React, { useState, useEffect, useRef } from 'react'
import { feedBacksSevice } from '@/services/feedBacksSevice'
import { FeedbackDataTable } from '@/components/feedbacks/FeedbackDataTable'
import { FeedbackDetailsDialog } from '@/components/feedbacks/FeedbackDetailsDialog'
import { Toast } from '@/components/prime'
import { useFeedbacks } from '@/hooks/useFeedbacks'

const Report_DCBC = () => {
    const toast = useRef<Toast>(null);
    const {
        feedbacks,
        loading,
        totalRecords,
        lazyParams,
        selectedFeedback,
        dialogVisible,
        infoLabels,
        onPage,
        viewDetails,
        setDialogVisible,
        fetchFeedbacks
    } = useFeedbacks("reflect", toast);

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks]);

    return (
        <AdminLayout title="Đề cương báo cáo (DCBC)" subtitle="Báo cáo định kỳ phản ánh y tế">
            <Toast ref={toast} />
            
            <div className="space-y-6">
                <FeedbackDataTable
                    feedbacks={feedbacks}
                    loading={loading}
                    totalRecords={totalRecords}
                    lazyParams={lazyParams}
                    onPage={onPage}
                    viewDetails={viewDetails}
                />

                <FeedbackDetailsDialog
                    dialogVisible={dialogVisible}
                    setDialogVisible={setDialogVisible}
                    selectedFeedback={selectedFeedback}
                    infoLabels={infoLabels}
                    type="reflect"
                />
            </div>
        </AdminLayout>
    )
}

export default Report_DCBC;