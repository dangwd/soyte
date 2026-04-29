// Node.js 18+ đã có sẵn fetch

const BASE_URL = "https://suckhoethudo.vn:7005/api";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlsicG9zdHMiLCJ1c2VycyIsIndvcmtfc2NoZWR1bGUiLCJmb3JtcyIsImZlZWRiYWNrIiwic29jaWFsX2ZhY2lsaXRpZXMiLCJyZWZsZWN0IiwiZXZhbHVhdGUiLCJyZXBvcnQiXSwiaWF0IjoxNzc3MzYxNzMzLCJleHAiOjE3Nzc0NDgxMzN9._2QBP_EXPTFOsiiVEHYy_7EpqzpRZ3wjVIc6LpP3-rs";
const DEFAULT_PASSWORD = "1234@abcd";

const defaultPermissions = {
  reflect: {
    view: true,
    children: {
      view: true,
      form: { view: true },
      list_feedback: { view: true },
      survey: { view: true }
    }
  },
  evaluate: {
    view: true,
    children: {
      view: true,
      form: { view: true },
      list_feedback: { view: true },
      survey: { view: true }
    }
  }
};

const hospitalsToProcess = [
  { full_name: "BV Hồng Ngọc", email: "quanlychatluongbvhnyn@gmail.com", unit: "bv-hong-ngoc" },
  { full_name: "BV Đa khoa Medlatec", email: "khth.bvdkmedlatec@medlatec.com", unit: "bv-medlatec" },
  { full_name: "BV VINMEC Times City", email: "v.vmtc.qlcl@vinmec.com", unit: "bv-vinmec-times-city" },
  { full_name: "BV Thu Cúc", email: "khth.bv@thucuchospital.vn", unit: "bv-thu-cuc" },
  { full_name: "BV Việt Pháp", email: "hang.caothi@hfh.com.vn", unit: "bv-viet-phap" },
  { full_name: "BV Thiên Đức", email: "thienduchospital@gmail.com", unit: "bv-thien-duc" },
  { full_name: "BV 16A Hà Đông", email: "benhviendk16ahadong@gmail.com", unit: "bv-16a-ha-dong" },
  { full_name: "BV Hồng Hà", email: "Phongkhth@benhvienhongha.com.vn", unit: "bv-hong-ha" },
  { full_name: "BV Hồng Phát", email: "cskhbenhvienhongphat@gmail.com", unit: "bv-hong-phat" },
  { full_name: "BV Bảo Sơn 2", email: "Phongkhth@baosonhospital.com", unit: "bv-bao-son-2" },
  { full_name: "BV Hà Thành", email: "quanlychatluonghathanh@gmail.com", unit: "bv-ha-thanh" },
  { full_name: "BV Đông Đô", email: "khthdongdo@gmail.com", unit: "bv-dong-do" },
  { full_name: "BV An Việt", email: "khth.benhvienanviet@gmail.com", unit: "bv-an-viet" },
  { full_name: "BV Tâm Anh", email: "qlcl@tamanhhospital.vn", unit: "bv-tam-anh" },
  { full_name: "BV Bắc Hà", email: "khth@benhvienbacha.vn", unit: "bv-bac-ha" },
  { full_name: "BV Phương Đông", email: "khthphuongdong@gmail.com", unit: "bv-phuong-dong" },
  { full_name: "BV Times", email: "khth@benhvientimes.vn", unit: "bv-times" },
  { full_name: "BV Hồng Ngọc Phúc Trường Minh", email: "qlclhongngochospital@gmail.com", unit: "bv-hong-ngoc-ptm" },
  { full_name: "BV Mắt Sài Gòn Hà Nội", email: "quynh.ttx@matsaigon.com", unit: "bv-mat-sai-gon" },
  { full_name: "BV Mắt Việt Nga", email: "khth.matvietnga@gmail.com", unit: "bv-mat-viet-nga" },
  { full_name: "BV Mắt Kỹ thuật cao Hà Nội", email: "khth@benhvienmat.vn", unit: "bv-mat-ky-thuat-cao" },
  { full_name: "BV Mắt Việt Nhật", email: "matvietnhat122tvv@gmail.com", unit: "bv-mat-viet-nhat" },
  { full_name: "BV Mắt Ánh Sáng", email: "benhvienmatanhsang@gmail.com", unit: "bv-mat-anh-sang" },
  { full_name: "BV Nam Học và Hiếm muộn HN", email: "contact@afhanoi.com", unit: "bv-nam-hoc" },
  { full_name: "BV Mắt Quốc tế DND", email: "qlclbvdnd.hn@matquoctednd.vn", unit: "bv-mat-dnd" },
  { full_name: "BV Phụ Sản An Thịnh", email: "chamsockhachhang@benhvienanthinh.vn", unit: "bv-phu-san-an-thinh" },
  { full_name: "BV Mắt Sài Gòn Hà Nội 1", email: "contact.msglang@matsaigon.com", unit: "bv-mat-sai-gon-1" },
  { full_name: "BV Mắt Quốc tế Nhật Bản", email: "cskh@jieh.vn", unit: "bv-mat-nhat-ban" },
  { full_name: "BV Thẩm mỹ Thu Cúc", email: "khth@thucucclinics.vn", unit: "bv-tham-my-thu-cuc" },
  { full_name: "BV Thẩm mỹ Kangnam", email: "phongkehoach@kangnam.vn", unit: "bv-tham-my-kangnam" },
  { full_name: "BV Hy vọng mới", email: "benhvienhyvongmoihanoi@gmail.com", unit: "bv-hy-vong-moi" },
  { full_name: "BV Việt Bỉ", email: "benhvienvietbi@gmail.com", unit: "bv-viet-bi" },
  { full_name: "BV Phụ sản Thiện An", email: "phongkhth20@gmail.com", unit: "bv-phu-san-thien-an" },
  { full_name: "BV Mắt Hà Nội 2", email: "mathanoi2@mathanoi2.vn", unit: "bv-mat-ha-noi-2" },
  { full_name: "BV Mắt Hồng Sơn", email: "khth@benhvienmathongson.com", unit: "bv-mat-hong-son" },
  { full_name: "BV Mắt Thiên Thanh", email: "hanhchinh.nhansu@matthienthanh.com", unit: "bv-mat-thien-thanh" },
  { full_name: "BV Mặt Trời", email: "qlcl.sih@sungrouphospital.com", unit: "bv-mat-troi" },
  { full_name: "BV Vinmec Smart City", email: "qlcl1185@gmail.com", unit: "bv-vinmec-smart-city" },
  { full_name: "BV Đại học Phenikaa", email: "qlcl@phenikaamec.vn", unit: "bv-phenikaa" },
  { full_name: "BV Đức Phúc", email: "huong.dl@benhvienducphuc.com", unit: "bv-duc-phuc" },
  { full_name: "BV Thăng Long", email: "bvtnthanglong@gmail.com", unit: "bv-thang-long" },
  { full_name: "BV DOLIFE", email: "p.khth@dolifehospital.vn", unit: "bv-dolife" },
  { full_name: "BV Ung Bướu Hưng Việt", email: "benhvienhungviet@benhvienhungviet.vn", unit: "bv-hung-viet" }
];

async function processHospitals() {
  console.log(`🚀 Bắt đầu xử lý ${hospitalsToProcess.length} bệnh viện...`);

  if (!AUTH_TOKEN || AUTH_TOKEN.length < 50) {
    console.error("❌ Lỗi: AUTH_TOKEN không hợp lệ!");
    return;
  }

  // 1. Lấy danh sách người dùng ban đầu
  const usersRes = await fetch(`${BASE_URL}/users?limit=1000`, {
    headers: { "Authorization": `Bearer ${AUTH_TOKEN}`, "Accept": "application/json" }
  });
  const allUsers = await usersRes.json();
  let userList = allUsers.data || [];

  for (const hospital of hospitalsToProcess) {
    const searchEmail = hospital.email.toLowerCase().trim();
    // Tìm kiếm trong danh sách lớn
    let existingUser = userList.find(u =>
      u.email?.toLowerCase().trim() === searchEmail ||
      u.username?.toLowerCase().trim() === searchEmail.split('@')[0]
    );

    const payload = {
      full_name: hospital.full_name,
      email: hospital.email,
      role: "admin",
      type: "BV", // Loại Bệnh viện
      unit: hospital.unit,
      permissions: defaultPermissions,
      status: hospital.status, // Kích hoạt luôn cho BV
    };

    try {
      let response;
      if (existingUser) {
        // CẬP NHẬT
        response = await fetch(`${BASE_URL}/users/${existingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${AUTH_TOKEN}` },
          body: JSON.stringify(payload)
        });
        if (response.ok) console.log(`🔄 Đã cập nhật: ${hospital.full_name} (ID: ${existingUser.id})`);
      } else {
        // THỬ TẠO MỚI
        response = await fetch(`${BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${AUTH_TOKEN}` },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          console.log(`✨ Đã tạo mới: ${hospital.full_name}`);
        } else {
          const err = await response.json();
          // Nếu lỗi báo đã tồn tại, hãy thử lấy danh sách lại hoặc báo qua
          if (err.message && (err.message.includes("đã được sử dụng") || err.message.includes("exists"))) {
            console.warn(`⚠️ Tài khoản ${hospital.email} đã tồn tại nhưng không lấy được ID để cập nhật tự động.`);
          } else {
            console.error(`❌ Lỗi ${hospital.email}: ${err.message || response.statusText}`);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Lỗi kết nối ${hospital.email}: ${error.message}`);
    }
    await new Promise(r => setTimeout(r, 150));
  }
  console.log("🏁 Hoàn tất xử lý!");
}

processHospitals();
