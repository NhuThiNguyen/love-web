/* =====================================================
   CÀI ĐẶT & HẰNG SỐ CƠ BẢN
===================================================== */
const PASSWORD = "260406";
const DEFAULT_START_DATE = "2024-04-26";
const DEFAULT_LOVE_POINTS = 1250;

/* =====================================================
   INDEXED DB DÀNH CHO LƯU TRỮ HÌNH ẢNH DUNG LƯỢNG LỚN
===================================================== */
const DB_NAME = "LoveAppDB";
const DB_VERSION = 1;
const PHOTO_STORE = "photos";

let dbInstance = null;

function initIndexedDB() {
    return new Promise((resolve) => {
        if (!window.indexedDB) {
            console.warn("Trình duyệt không hỗ trợ IndexedDB, dùng localStorage fallback");
            resolve(null);
            return;
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(PHOTO_STORE)) {
                db.createObjectStore(PHOTO_STORE, { keyPath: "id" });
            }
        };
        request.onsuccess = function (event) {
            dbInstance = event.target.result;
            resolve(dbInstance);
        };
        request.onerror = function () {
            console.error("Không thể mở IndexedDB, fallback localStorage");
            resolve(null);
        };
    });
}

function dbSavePhoto(photoObj) {
    return new Promise((resolve) => {
        if (!dbInstance) {
            let photos = getLocalPhotosFallback();
            photos.unshift(photoObj);
            localStorage.setItem("LOVE_PHOTOS_FALLBACK", JSON.stringify(photos));
            resolve(true);
            return;
        }
        const tx = dbInstance.transaction(PHOTO_STORE, "readwrite");
        const store = tx.objectStore(PHOTO_STORE);
        store.put(photoObj);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
    });
}

function dbGetAllPhotos() {
    return new Promise((resolve) => {
        if (!dbInstance) {
            resolve(getLocalPhotosFallback());
            return;
        }
        const tx = dbInstance.transaction(PHOTO_STORE, "readonly");
        const store = tx.objectStore(PHOTO_STORE);
        const request = store.getAll();
        request.onsuccess = () => {
            const list = request.result || [];
            list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            resolve(list);
        };
        request.onerror = () => resolve([]);
    });
}

function dbDeletePhoto(id) {
    return new Promise((resolve) => {
        if (!dbInstance) {
            let photos = getLocalPhotosFallback();
            photos = photos.filter((p) => p.id !== id);
            localStorage.setItem("LOVE_PHOTOS_FALLBACK", JSON.stringify(photos));
            resolve(true);
            return;
        }
        const tx = dbInstance.transaction(PHOTO_STORE, "readwrite");
        const store = tx.objectStore(PHOTO_STORE);
        store.delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
    });
}

function getLocalPhotosFallback() {
    try {
        const raw = localStorage.getItem("LOVE_PHOTOS_FALLBACK");
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

/* =====================================================
   ELEMENT REFERENCES
===================================================== */
// Screens
const introScreen = document.getElementById("introScreen");
const passwordScreen = document.getElementById("passwordScreen");
const mainAppScreen = document.getElementById("mainAppScreen");
const endingScreen = document.getElementById("endingScreen");

// Password Elements
const beeButton = document.getElementById("beeButton");
const continueButton = document.getElementById("continueButton");
const passwordDots = document.querySelectorAll("#passwordDots span");
const keypadButtons = document.querySelectorAll(".number-button[data-number]");
const deleteButton = document.getElementById("deleteButton");
const passwordContainer = document.querySelector(".password-container");
const wrongPasswordPopup = document.getElementById("wrongPasswordPopup");
const correctPasswordPopup = document.getElementById("correctPasswordPopup");
let enteredPassword = "";

// Main App & Sidebar Elements
const appSidebar = document.getElementById("appSidebar");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const navItems = document.querySelectorAll(".nav-item");
const appPages = document.querySelectorAll(".app-page");

// Love Clock Elements
const liveDayTotal = document.getElementById("liveDayTotal");
const liveDateBreakdown = document.getElementById("liveDateBreakdown");
const liveHours = document.getElementById("liveHours");
const liveMinutes = document.getElementById("liveMinutes");
const liveSeconds = document.getElementById("liveSeconds");
const loveStartDateInput = document.getElementById("loveStartDateInput");
const saveStartDateBtn = document.getElementById("saveStartDateBtn");
const navDayBadge = document.getElementById("navDayBadge");
const quickDaysCount = document.getElementById("quickDaysCount");
const milestonesGrid = document.getElementById("milestonesGrid");

// Love Points Elements
const mainLovePointsVal = document.getElementById("mainLovePointsVal");
const sidebarLovePoints = document.getElementById("sidebarLovePoints");
const quickPointsCount = document.getElementById("quickPointsCount");
const navPointBadge = document.getElementById("navPointBadge");
const loveRankTag = document.getElementById("loveRankTag");
const loveRankDesc = document.getElementById("loveRankDesc");
const pointReasonInput = document.getElementById("pointReasonInput");
const customAddPointBtn = document.getElementById("customAddPointBtn");
const customMinusPointBtn = document.getElementById("customMinusPointBtn");
const pointHistoryList = document.getElementById("pointHistoryList");
const floatingToastContainer = document.getElementById("floatingToastContainer");

// Storage / AutoSave Elements
const autoSaveText = document.getElementById("autoSaveText");
const sidebarAutoSaveStatus = document.getElementById("sidebarAutoSaveStatus");
const storageLastSavedTime = document.getElementById("storageLastSavedTime");
const storageDateDisplay = document.getElementById("storageDateDisplay");
const storagePointsDisplay = document.getElementById("storagePointsDisplay");
const storagePhotosDisplay = document.getElementById("storagePhotosDisplay");
const storageNotesDisplay = document.getElementById("storageNotesDisplay");
const exportDataBtn = document.getElementById("exportDataBtn");
const importDataInput = document.getElementById("importDataInput");
const resetDataBtn = document.getElementById("resetDataBtn");

// Notes Elements
const newLoveNoteInput = document.getElementById("newLoveNoteInput");
const noteAuthorSelect = document.getElementById("noteAuthorSelect");
const sendLoveNoteBtn = document.getElementById("sendLoveNoteBtn");
const loveNotesList = document.getElementById("loveNotesList");

// Photo Elements
const tabPolaroidBtn = document.getElementById("tabPolaroidBtn");
const tabGalaxyBtn = document.getElementById("tabGalaxyBtn");
const polaroidGalleryView = document.getElementById("polaroidGalleryView");
const galaxyGalleryView = document.getElementById("galaxyGalleryView");
const openUploadModalBtn = document.getElementById("openUploadModalBtn");
const galleryCountBadge = document.getElementById("galleryCountBadge");
const quickPhotosCount = document.getElementById("quickPhotosCount");
const polaroidGrid = document.getElementById("polaroidGrid");

// Upload Modal Elements
const uploadPhotoModal = document.getElementById("uploadPhotoModal");
const closeUploadModalBtn = document.getElementById("closeUploadModalBtn");
const photoDropzone = document.getElementById("photoDropzone");
const photoFileInput = document.getElementById("photoFileInput");
const dropzoneEmpty = document.getElementById("dropzoneEmpty");
const dropzonePreview = document.getElementById("dropzonePreview");
const previewImage = document.getElementById("previewImage");
const removePreviewBtn = document.getElementById("removePreviewBtn");
const photoCaptionInput = document.getElementById("photoCaptionInput");
const photoDateInput = document.getElementById("photoDateInput");
const confirmUploadBtn = document.getElementById("confirmUploadBtn");
let currentUploadBase64 = "";

// Lightbox Elements
const galleryPopup = document.getElementById("galleryPopup");
const galleryPopupImage = document.getElementById("galleryPopupImage");
const galleryPopupMessage = document.getElementById("galleryPopupMessage");
const galleryPopupDate = document.getElementById("galleryPopupDate");
const closeGallery = document.getElementById("closeGallery");
const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
const lightboxNextBtn = document.getElementById("lightboxNextBtn");
let currentPhotoList = [];
let currentLightboxIndex = 0;

// Quotes
const quotes = [
    "Có những ngày bình thường nhưng lại trở nên thật đặc biệt, chỉ vì ngày hôm đó có anh bên cạnh.",
    "Cảm ơn anh vì đã xuất hiện, đã yêu thương và luôn che chở cho em.",
    "Dù mai này thế giới có đổi thay ra sao, trong tim em vị trí của anh vẫn luôn nguyên vẹn.",
    "Hạnh phúc không phải là đích đến, mà là từng khoảnh khắc ngọt ngào chúng ta cùng nhau trải qua.",
    "Mỗi nụ cười của anh đều là ánh nắng sưởi ấm cả một ngày dài của em."
];

/* =====================================================
   CHUYỂN SCREEN
===================================================== */
function showScreen(screen) {
    document.querySelectorAll(".screen").forEach((item) => {
        item.classList.remove("active");
    });
    if (!screen) return;
    screen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Bắt đầu từ chú ong
if (beeButton) {
    beeButton.addEventListener("click", function () {
        showScreen(passwordScreen);
    });
}

/* =====================================================
   PASSWORD LOGIC
===================================================== */
function updatePasswordDots() {
    passwordDots.forEach((dot, index) => {
        if (index < enteredPassword.length) {
            dot.classList.add("filled");
        } else {
            dot.classList.remove("filled");
        }
    });
}

function checkPassword() {
    if (enteredPassword.length !== PASSWORD.length) return;
    if (enteredPassword === PASSWORD) {
        correctPassword();
    } else {
        wrongPassword();
    }
}

function wrongPassword() {
    if (passwordContainer) {
        passwordContainer.classList.remove("shake");
        void passwordContainer.offsetWidth;
        passwordContainer.classList.add("shake");
    }
    if (wrongPasswordPopup) {
        wrongPasswordPopup.classList.add("show");
        setTimeout(function () {
            wrongPasswordPopup.classList.remove("show");
            enteredPassword = "";
            updatePasswordDots();
        }, 1800);
    }
}

function correctPassword() {
    if (!correctPasswordPopup) return;
    correctPasswordPopup.classList.remove("show");
    void correctPasswordPopup.offsetWidth;
    correctPasswordPopup.classList.add("show");
}

if (continueButton) {
    continueButton.addEventListener("click", function () {
        if (correctPasswordPopup) {
            correctPasswordPopup.classList.remove("show");
        }
        enteredPassword = "";
        updatePasswordDots();
        showScreen(mainAppScreen);
        switchAppPage("homePage");
    });
}

keypadButtons.forEach((button) => {
    button.addEventListener("click", function () {
        if (enteredPassword.length >= PASSWORD.length) return;
        enteredPassword += button.dataset.number;
        updatePasswordDots();
        if (enteredPassword.length === PASSWORD.length) {
            setTimeout(checkPassword, 250);
        }
    });
});

if (deleteButton) {
    deleteButton.addEventListener("click", function () {
        enteredPassword = "";
        updatePasswordDots();
    });
}

/* =====================================================
   SIDEBAR & ĐIỀU HƯỚNG TRANG
===================================================== */
function switchAppPage(pageId) {
    if (!pageId) return;

    // Reset quà tặng nếu rời khỏi hoặc vào
    if (pageId === "giftPage") {
        resetGiftPage();
    }

    // Cập nhật page
    appPages.forEach((page) => {
        page.classList.remove("active");
    });
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add("active");
    }

    if (pageId === "galleryPage") {
        setTimeout(startGalaxyMotion, 80);
    }

    // Cập nhật active nav
    navItems.forEach((item) => {
        if (item.dataset.page === pageId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Đóng drawer trên mobile
    closeSidebarDrawer();

    // Cuộn lên đầu
    const mainContent = document.getElementById("mainContent");
    if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Click nav item
navItems.forEach((btn) => {
    btn.addEventListener("click", function () {
        const page = this.dataset.page;
        switchAppPage(page);
    });
});

// Thẻ nhảy nhanh (Quick jump)
document.querySelectorAll("[data-jump]").forEach((card) => {
    card.addEventListener("click", function () {
        const page = this.dataset.jump;
        switchAppPage(page);
    });
});

// Mobile menu toggle
function openSidebarDrawer() {
    if (appSidebar) appSidebar.classList.add("open");
    if (sidebarBackdrop) sidebarBackdrop.classList.add("active");
}

function closeSidebarDrawer() {
    if (appSidebar) appSidebar.classList.remove("open");
    if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", openSidebarDrawer);
}
if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", closeSidebarDrawer);
}
if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", closeSidebarDrawer);
}

/* =====================================================
   BỘ ĐẾM NGÀY YÊU THỜI GIAN THỰC (REAL-TIME CLOCK)
===================================================== */
function getStartDate() {
    return localStorage.getItem("LOVE_START_DATE") || DEFAULT_START_DATE;
}

function setStartDate(dateStr) {
    if (!dateStr) return;
    localStorage.setItem("LOVE_START_DATE", dateStr);
    triggerAutoSave();
    updateLoveClock();
    renderMilestones();
    updateStorageSummary();
}

function updateLoveClock() {
    const startStr = getStartDate();
    const startDate = new Date(startStr + "T00:00:00");
    const now = new Date();

    if (isNaN(startDate.getTime())) return;

    // Tổng số ngày
    const diffMs = now - startDate;
    const isFuture = diffMs < 0;
    const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (liveDayTotal) liveDayTotal.textContent = totalDays;
    if (quickDaysCount) quickDaysCount.textContent = totalDays + " ngày";
    if (navDayBadge) navDayBadge.textContent = totalDays + " ngày";

    // Tính chi tiết Năm - Tháng - Ngày
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    if (days < 0) {
        months -= 1;
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonthDate.getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    if (years < 0) {
        years = 0;
        months = 0;
        days = totalDays;
    }

    if (liveDateBreakdown) {
        liveDateBreakdown.textContent = `${years} năm ${months} tháng ${days} ngày`;
    }

    // Giờ, Phút, Giây hiện tại
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");

    if (liveHours) liveHours.textContent = h;
    if (liveMinutes) liveMinutes.textContent = m;
    if (liveSeconds) liveSeconds.textContent = s;
}

// Cột mốc kỷ niệm
function renderMilestones() {
    if (!milestonesGrid) return;
    const startStr = getStartDate();
    const startDate = new Date(startStr + "T00:00:00");
    const now = new Date();
    const totalDays = Math.max(0, Math.floor((now - startDate) / (1000 * 60 * 60 * 24)));

    const milestoneTargets = [
        { days: 100, name: "100 Ngày Yêu" },
        { days: 200, name: "200 Ngày Yêu" },
        { days: 365, name: "1 Năm Bên Nhau ❤️" },
        { days: 500, name: "500 Ngày Gắn Kết" },
        { days: 730, name: "2 Năm Mặn Nồng" },
        { days: 1000, name: "1000 Ngày Hạnh Phúc 👑" }
    ];

    milestonesGrid.innerHTML = "";
    milestoneTargets.forEach((m) => {
        const reached = totalDays >= m.days;
        const card = document.createElement("div");
        card.className = `milestone-card ${reached ? "reached" : ""}`;
        card.innerHTML = `
            <div class="milestone-icon">${reached ? "🎉" : "⏳"}</div>
            <div class="milestone-title">${m.name}</div>
            <div class="milestone-status">${
                reached ? "Đã đạt được ❤️" : `Còn ${m.days - totalDays} ngày nữa`
            }</div>
        `;
        milestonesGrid.appendChild(card);
    });
}

// Thiết lập ngày bắt đầu yêu
if (saveStartDateBtn && loveStartDateInput) {
    loveStartDateInput.value = getStartDate();
    saveStartDateBtn.addEventListener("click", function () {
        const val = loveStartDateInput.value;
        if (!val) {
            alert("Vui lòng chọn ngày hợp lệ nhé ❤️");
            return;
        }
        setStartDate(val);
        showFloatingToast(`💖 Đã cập nhật ngày yêu: ${val}`);
    });
}

/* =====================================================
   HỆ THỐNG ĐIỂM TÌNH YÊU (LOVE POINTS)
===================================================== */
function getLovePoints() {
    const raw = localStorage.getItem("LOVE_POINTS");
    return raw !== null ? parseInt(raw, 10) : DEFAULT_LOVE_POINTS;
}

function getPointHistory() {
    try {
        const raw = localStorage.getItem("LOVE_POINT_HISTORY");
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function updateLovePointsDisplay() {
    const points = getLovePoints();
    if (mainLovePointsVal) mainLovePointsVal.textContent = points;
    if (sidebarLovePoints) sidebarLovePoints.textContent = points;
    if (quickPointsCount) quickPointsCount.textContent = points;
    if (navPointBadge) navPointBadge.textContent = points;
    if (storagePointsDisplay) storagePointsDisplay.textContent = points + " điểm";

    // Cấp độ / Danh hiệu
    let rankTitle = "👑 Tình Yêu Vĩnh Cửu";
    let rankText = "Chúng mình sinh ra là để dành cho nhau!";

    if (points < 500) {
        rankTitle = "🌱 Mới Chớm Hẹn Hò";
        rankText = "Từng bước khám phá thế giới của nhau!";
    } else if (points < 1000) {
        rankTitle = "💖 Say Đắm Ngọt Ngào";
        rankText = "Mỗi ngày trôi qua đều ngập tràn nụ cười!";
    } else if (points < 2500) {
        rankTitle = "👑 Tình Yêu Vĩnh Cửu";
        rankText = "Chúng mình sinh ra là để dành cho nhau!";
    } else {
        rankTitle = "🌌 Vũ Trụ Tình Yêu";
        rankText = "Yêu anh/em nhiều hơn cả các vì sao trên trời!";
    }

    if (loveRankTag) loveRankTag.textContent = rankTitle;
    if (loveRankDesc) loveRankDesc.textContent = rankText;
}

function changeLovePoints(amount, reason = "") {
    let current = getLovePoints();
    current += amount;
    localStorage.setItem("LOVE_POINTS", current);

    // Lưu lịch sử
    const history = getPointHistory();
    const item = {
        id: Date.now(),
        amount,
        reason: reason || (amount > 0 ? "Thưởng điểm yêu thương" : "Phạt nhẹ vì dỗi"),
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toLocaleDateString("vi-VN")
    };
    history.unshift(item);
    if (history.length > 20) history.pop();
    localStorage.setItem("LOVE_POINT_HISTORY", JSON.stringify(history));

    // Hiệu ứng nổi bay lên
    const prefix = amount > 0 ? "+" : "";
    const icon = amount > 0 ? "❤️" : "💔";
    showFloatingScore(`${icon} ${prefix}${amount} điểm tình yêu`, amount > 0);

    updateLovePointsDisplay();
    renderPointHistory();
    triggerAutoSave();
}

function renderPointHistory() {
    if (!pointHistoryList) return;
    const history = getPointHistory();
    pointHistoryList.innerHTML = "";

    if (history.length === 0) {
        pointHistoryList.innerHTML = `
            <div style="text-align:center; color:#9d5872; padding:16px;">
                Chưa có biến động điểm nào. Hãy cộng hoặc trừ điểm để tạo kỷ niệm nhé!
            </div>
        `;
        return;
    }

    history.forEach((h) => {
        const row = document.createElement("div");
        row.className = `history-item ${h.amount < 0 ? "minus" : ""}`;
        row.innerHTML = `
            <div class="history-reason">
                ${h.reason}
                <small style="display:block; color:#9d5872; font-weight:normal; font-size:12px;">${h.time} - ${h.date}</small>
            </div>
            <div class="history-points ${h.amount >= 0 ? "positive" : "negative"}">
                ${h.amount > 0 ? "+" : ""}${h.amount}
            </div>
        `;
        pointHistoryList.appendChild(row);
    });
}

// Bắt sự kiện các nút điểm nhanh
document.querySelectorAll(".btn-point").forEach((btn) => {
    btn.addEventListener("click", function () {
        const val = parseInt(this.dataset.points, 10);
        changeLovePoints(val);
    });
});

if (customAddPointBtn && pointReasonInput) {
    customAddPointBtn.addEventListener("click", function () {
        const reason = pointReasonInput.value.trim() || "Thưởng ngoan";
        changeLovePoints(10, reason);
        pointReasonInput.value = "";
    });
}

if (customMinusPointBtn && pointReasonInput) {
    customMinusPointBtn.addEventListener("click", function () {
        const reason = pointReasonInput.value.trim() || "Trừ điểm hư";
        changeLovePoints(-10, reason);
        pointReasonInput.value = "";
    });
}

/* =====================================================
   AUTO SAVE & QUẢN LÝ DỮ LIỆU
===================================================== */
let autoSaveTimeout = null;

function triggerAutoSave() {
    const nowStr = new Date().toLocaleTimeString("vi-VN");
    if (autoSaveText) autoSaveText.textContent = "💾 Đã tự động lưu";
    if (sidebarAutoSaveStatus) {
        sidebarAutoSaveStatus.classList.remove("saving");
        void sidebarAutoSaveStatus.offsetWidth;
        sidebarAutoSaveStatus.classList.add("saving");
    }
    if (storageLastSavedTime) {
        storageLastSavedTime.textContent = `Đã tự động lưu vào bộ nhớ trình duyệt lúc ${nowStr}.`;
    }

    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        if (sidebarAutoSaveStatus) sidebarAutoSaveStatus.classList.remove("saving");
    }, 1500);

    updateStorageSummary();
}

async function updateStorageSummary() {
    if (storageDateDisplay) storageDateDisplay.textContent = getStartDate();
    if (storagePointsDisplay) storagePointsDisplay.textContent = getLovePoints() + " điểm";

    const photos = await dbGetAllPhotos();
    if (storagePhotosDisplay) storagePhotosDisplay.textContent = `${photos.length} bức ảnh`;

    const notes = getLoveNotes();
    if (storageNotesDisplay) storageNotesDisplay.textContent = `${notes.length} lời nhắn`;
}

// Xuất file JSON
if (exportDataBtn) {
    exportDataBtn.addEventListener("click", async function () {
        const photos = await dbGetAllPhotos();
        const backupData = {
            startDate: getStartDate(),
            lovePoints: getLovePoints(),
            pointHistory: getPointHistory(),
            loveNotes: getLoveNotes(),
            photos: photos,
            exportedAt: new Date().toISOString()
        };

        const jsonStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `love-story-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showFloatingToast("📥 Đã tải file sao lưu thành công!");
    });
}

// Nhập file JSON
if (importDataInput) {
    importDataInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function (evt) {
            try {
                const data = JSON.parse(evt.target.result);
                if (data.startDate) localStorage.setItem("LOVE_START_DATE", data.startDate);
                if (data.lovePoints !== undefined) localStorage.setItem("LOVE_POINTS", data.lovePoints);
                if (data.pointHistory) localStorage.setItem("LOVE_POINT_HISTORY", JSON.stringify(data.pointHistory));
                if (data.loveNotes) localStorage.setItem("LOVE_NOTES", JSON.stringify(data.loveNotes));

                if (Array.isArray(data.photos)) {
                    for (const p of data.photos) {
                        await dbSavePhoto(p);
                    }
                }

                alert("Nhập dữ liệu thành công! Trang sẽ tải lại dữ liệu mới ❤️");
                window.location.reload();
            } catch (err) {
                alert("File không hợp lệ hoặc bị lỗi định dạng!");
            }
        };
        reader.readAsText(file);
    });
}

// Đặt lại dữ liệu
if (resetDataBtn) {
    resetDataBtn.addEventListener("click", function () {
        const confirm1 = confirm("Anh/em có chắc chắn muốn đặt lại dữ liệu về ban đầu không?");
        if (!confirm1) return;
        localStorage.removeItem("LOVE_START_DATE");
        localStorage.removeItem("LOVE_POINTS");
        localStorage.removeItem("LOVE_POINT_HISTORY");
        localStorage.removeItem("LOVE_NOTES");
        localStorage.removeItem("LOVE_PHOTOS_FALLBACK");
        alert("Đã đặt lại dữ liệu mặc định!");
        window.location.reload();
    });
}

/* =====================================================
   LỜI YÊU THƯƠNG (ENVELOPE & HÒM THƯ KỶ NIỆM)
===================================================== */
const envelope = document.querySelector(".envelope");
const envelopeHint = document.getElementById("envelopeHint");
const letterHearts = document.getElementById("letterHearts");
let envelopeOpened = false;

if (envelope) {
    envelope.addEventListener("click", function () {
        if (!envelopeOpened) {
            envelopeOpened = true;
            envelope.classList.add("open");

            if (envelopeHint) {
                envelopeHint.textContent = "Nhấn vào phong thư để gập lại 💌";
            }

            if (letterHearts) {
                letterHearts.classList.remove("show");
                void letterHearts.offsetWidth;
                letterHearts.classList.add("show");
                setTimeout(function () {
                    letterHearts.classList.remove("show");
                }, 2200);
            }
        } else {
            envelopeOpened = false;
            envelope.classList.remove("open");

            if (envelopeHint) {
                envelopeHint.textContent = "Nhấn vào phong thư để mở ❤️";
            }
        }
    });
}

function getLoveNotes() {
    try {
        const raw = localStorage.getItem("LOVE_NOTES");
        return raw ? JSON.parse(raw) : [
            {
                id: 1,
                author: "Em gửi Anh",
                text: "Anh nhớ uống nhiều nước và ăn uống đúng bữa nhé, yêu anh! 🌸",
                time: "10:30",
                date: "Hôm nay"
            }
        ];
    } catch (e) {
        return [];
    }
}

function renderLoveNotes() {
    if (!loveNotesList) return;
    const notes = getLoveNotes();
    loveNotesList.innerHTML = "";

    notes.forEach((n) => {
        const bubble = document.createElement("div");
        bubble.className = "love-note-bubble";
        bubble.innerHTML = `
            <div class="note-bubble-header">
                <span class="note-author">${n.author}</span>
                <div>
                    <span class="note-time">${n.time} - ${n.date}</span>
                    <button class="delete-note-btn" data-id="${n.id}" title="Xóa lời nhắn">×</button>
                </div>
            </div>
            <p class="note-bubble-text">${escapeHtml(n.text)}</p>
        `;
        loveNotesList.appendChild(bubble);
    });

    document.querySelectorAll(".delete-note-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            const id = parseInt(this.dataset.id, 10);
            deleteLoveNote(id);
        });
    });
}

function addLoveNote(text, author) {
    if (!text.trim()) return;
    const notes = getLoveNotes();
    const newNote = {
        id: Date.now(),
        author: author || "Em gửi Anh",
        text: text.trim(),
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toLocaleDateString("vi-VN")
    };
    notes.unshift(newNote);
    localStorage.setItem("LOVE_NOTES", JSON.stringify(notes));
    renderLoveNotes();
    triggerAutoSave();
    showFloatingToast("💌 Đã gửi lời yêu thương thành công!");
}

function deleteLoveNote(id) {
    let notes = getLoveNotes();
    notes = notes.filter((n) => n.id !== id);
    localStorage.setItem("LOVE_NOTES", JSON.stringify(notes));
    renderLoveNotes();
    triggerAutoSave();
}

if (sendLoveNoteBtn && newLoveNoteInput) {
    sendLoveNoteBtn.addEventListener("click", function () {
        const text = newLoveNoteInput.value;
        const author = noteAuthorSelect ? noteAuthorSelect.value : "Em gửi Anh";
        if (!text.trim()) {
            alert("Vui lòng nhập lời yêu thương nhé ❤️");
            return;
        }
        addLoveNote(text, author);
        newLoveNoteInput.value = "";
    });
}

/* =====================================================
   TRANG HÌNH ẢNH: POLAROID SCRAPBOOK & LIGHTBOX
===================================================== */
// Khởi tạo các ảnh mẫu mặc định cho trang Album Ảnh của chúng mình

// Khởi tạo các ảnh mẫu mặc định
const INITIAL_DEMO_PHOTOS = [
    {
        id: "demo-1",
        src: "images/totnghiep.jpg",
        caption: "Hai đứa mình trong ngày tốt nghiệp ❤️",
        date: "26/04/2024",
        timestamp: 1714089600000
    },
    {
        id: "demo-2",
        src: "images/cty.jpg",
        caption: "Một ngày rất bình thường nhưng đẹp nhất 💕",
        date: "15/05/2024",
        timestamp: 1715731200000
    },
    {
        id: "demo-3",
        src: "images/giangsinh.jpg",
        caption: "Mùa đông có anh chẳng còn thấy lạnh ❄️",
        date: "24/12/2024",
        timestamp: 1735000000000
    },
    {
        id: "demo-4",
        src: "images/home.jpg",
        caption: "Những phút giây bình yên bên nhau 🏡",
        date: "10/01/2025",
        timestamp: 1736467200000
    },
    {
        id: "demo-5",
        src: "images/vui.jpg",
        caption: "Chỉ cần nhìn thấy nụ cười của anh 🥰",
        date: "14/02/2025",
        timestamp: 1739491200000
    },
    {
        id: "demo-6",
        src: "images/noel.jpg",
        caption: "Lưu giữ mãi từng ngày tháng có anh 🎁",
        date: "25/12/2024",
        timestamp: 1735084800000
    }
];

async function loadAndRenderPolaroidGrid() {
    let photos = await dbGetAllPhotos();
    if (photos.length === 0) {
        // Nạp demo nếu chưa có
        for (const demo of INITIAL_DEMO_PHOTOS) {
            await dbSavePhoto(demo);
        }
        photos = await dbGetAllPhotos();
    }

    currentPhotoList = photos;

    if (galleryCountBadge) galleryCountBadge.textContent = `${photos.length} bức ảnh`;
    if (quickPhotosCount) quickPhotosCount.textContent = `${photos.length} ảnh`;

    if (!polaroidGrid) return;
    polaroidGrid.innerHTML = "";

    const rotations = [-2.5, 1.8, -1.2, 2.8, -2, 1.5];

    photos.forEach((photo, idx) => {
        const rot = rotations[idx % rotations.length];
        const card = document.createElement("div");
        card.className = "polaroid-card";
        card.style.transform = `rotate(${rot}deg)`;

        card.innerHTML = `
            <div class="polaroid-tape"></div>
            <button class="polaroid-delete-btn" data-id="${photo.id}" title="Xóa bức ảnh này">✕</button>
            <div class="polaroid-img-wrap">
                <img src="${photo.src}" alt="${escapeHtml(photo.caption || 'Kỷ niệm')}">
            </div>
            <div class="polaroid-meta">
                <span class="polaroid-caption">${escapeHtml(photo.caption || 'Kỷ niệm của chúng mình ❤️')}</span>
                <span class="polaroid-date">${photo.date || ''}</span>
            </div>
        `;

        // Click mở Lightbox
        card.addEventListener("click", function (e) {
            if (e.target.closest(".polaroid-delete-btn")) return;
            openLightbox(idx);
        });

        polaroidGrid.appendChild(card);
    });

    // Bắt sự kiện xóa ảnh
    document.querySelectorAll(".polaroid-delete-btn").forEach((btn) => {
        btn.addEventListener("click", async function (e) {
            e.stopPropagation();
            const id = this.dataset.id;
            const confirmDel = confirm("Anh/em có chắc muốn xóa bức ảnh kỷ niệm này không?");
            if (!confirmDel) return;

            await dbDeletePhoto(id);
            triggerAutoSave();
            await loadAndRenderPolaroidGrid();
            showFloatingToast("🗑️ Đã xóa ảnh khỏi album");
        });
    });
}

// Modal Upload Photo
if (openUploadModalBtn) {
    openUploadModalBtn.addEventListener("click", function () {
        if (uploadPhotoModal) {
            uploadPhotoModal.classList.add("show");
            resetUploadForm();
        }
    });
}

if (closeUploadModalBtn) {
    closeUploadModalBtn.addEventListener("click", function () {
        if (uploadPhotoModal) uploadPhotoModal.classList.remove("show");
    });
}

if (uploadPhotoModal) {
    uploadPhotoModal.addEventListener("click", function (e) {
        if (e.target === uploadPhotoModal) {
            uploadPhotoModal.classList.remove("show");
        }
    });
}

function resetUploadForm() {
    currentUploadBase64 = "";
    if (photoFileInput) photoFileInput.value = "";
    if (dropzoneEmpty) dropzoneEmpty.style.display = "block";
    if (dropzonePreview) dropzonePreview.style.display = "none";
    if (previewImage) previewImage.src = "";
    if (photoCaptionInput) photoCaptionInput.value = "";
    if (photoDateInput) {
        photoDateInput.value = new Date().toISOString().slice(0, 10);
    }
}

if (photoFileInput) {
    photoFileInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;
        handleSelectedImage(file);
    });
}

if (removePreviewBtn) {
    removePreviewBtn.addEventListener("click", function () {
        resetUploadForm();
    });
}

function handleSelectedImage(file) {
    if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh!");
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        // Nén ảnh nhẹ qua Canvas trước khi lưu
        compressImage(e.target.result, 1200, 1200, 0.85, function (compressedBase64) {
            currentUploadBase64 = compressedBase64;
            if (previewImage) previewImage.src = compressedBase64;
            if (dropzoneEmpty) dropzoneEmpty.style.display = "none";
            if (dropzonePreview) dropzonePreview.style.display = "block";
        });
    };
    reader.readAsDataURL(file);
}

function compressImage(src, maxWidth, maxHeight, quality, callback) {
    const img = new Image();
    img.src = src;
    img.onload = function () {
        let width = img.width;
        let height = img.height;
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round((height *= maxWidth / width));
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round((width *= maxHeight / height));
                height = maxHeight;
            }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL("image/jpeg", quality));
    };
}

if (confirmUploadBtn) {
    confirmUploadBtn.addEventListener("click", async function () {
        if (!currentUploadBase64) {
            alert("Vui lòng chọn hình ảnh trước khi đăng nhé ❤️");
            return;
        }
        const caption = photoCaptionInput.value.trim() || "Khoảnh khắc ngọt ngào ❤️";
        const dateVal = photoDateInput.value
            ? new Date(photoDateInput.value).toLocaleDateString("vi-VN")
            : new Date().toLocaleDateString("vi-VN");

        const newPhoto = {
            id: "photo-" + Date.now(),
            src: currentUploadBase64,
            caption: caption,
            date: dateVal,
            timestamp: Date.now()
        };

        await dbSavePhoto(newPhoto);
        triggerAutoSave();
        if (uploadPhotoModal) uploadPhotoModal.classList.remove("show");
        resetUploadForm();
        await loadAndRenderPolaroidGrid();
        showFloatingToast("📸 Đã thêm ảnh vào Album thành công!");
    });
}

// Lightbox Logic
function openLightbox(index) {
    if (!currentPhotoList || currentPhotoList.length === 0) return;
    currentLightboxIndex = index;
    updateLightboxContent();
    if (galleryPopup) galleryPopup.classList.add("show");
}

function updateLightboxContent() {
    const photo = currentPhotoList[currentLightboxIndex];
    if (!photo) return;
    if (galleryPopupImage) galleryPopupImage.src = photo.src;
    if (galleryPopupMessage) galleryPopupMessage.textContent = photo.caption || "";
    if (galleryPopupDate) galleryPopupDate.textContent = photo.date ? `Ngày chụp: ${photo.date}` : "";
}

function showPrevPhoto() {
    if (currentPhotoList.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + currentPhotoList.length) % currentPhotoList.length;
    updateLightboxContent();
}

function showNextPhoto() {
    if (currentPhotoList.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % currentPhotoList.length;
    updateLightboxContent();
}

if (lightboxPrevBtn) lightboxPrevBtn.addEventListener("click", showPrevPhoto);
if (lightboxNextBtn) lightboxNextBtn.addEventListener("click", showNextPhoto);

if (closeGallery) {
    closeGallery.addEventListener("click", function () {
        if (galleryPopup) galleryPopup.classList.remove("show");
    });
}

if (galleryPopup) {
    galleryPopup.addEventListener("click", function (e) {
        if (e.target === galleryPopup) {
            galleryPopup.classList.remove("show");
        }
    });
}

window.addEventListener("keydown", function (e) {
    if (galleryPopup && galleryPopup.classList.contains("show")) {
        if (e.key === "ArrowLeft") showPrevPhoto();
        if (e.key === "ArrowRight") showNextPhoto();
        if (e.key === "Escape") galleryPopup.classList.remove("show");
    }
});

/* =====================================================
   THIÊN HÀ KÝ ỨC (BẢO TOÀN HIỆU ỨNG VẬT LÝ NGUYÊN BẢN)
===================================================== */
const floatingPhotos = document.querySelectorAll(".floating-photo");
const galaxy = document.querySelector(".galaxy");

floatingPhotos.forEach((photo) => {
    photo.addEventListener("click", function () {
        if (galleryPopupImage) galleryPopupImage.src = photo.dataset.image;
        if (galleryPopupMessage) galleryPopupMessage.textContent = photo.dataset.message;
        if (galleryPopupDate) galleryPopupDate.textContent = "";
        if (galleryPopup) galleryPopup.classList.add("show");
    });
});

let galaxyMotionStarted = false;
const startGalaxyMotion = () => {
    if (!galaxy || !floatingPhotos.length) return;
    if (galaxyMotionStarted) return;
    if (!galaxy.clientWidth || !galaxy.clientHeight) {
        requestAnimationFrame(startGalaxyMotion);
        return;
    }
    galaxyMotionStarted = true;

    const photoMotion = [];
    const horizontalDirections = [1, -1, 1, -1, -1, 1, -1, 1, 1, -1, -1, 1, -1, 1, 1, -1];
    const verticalDirections = [-1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, -1, 1, -1, -1, 1];
    const centerOffsets = [
        [-130, -105], [-45, -125], [50, -110], [125, -75],
        [-145, -20], [-55, -35], [40, -25], [135, -5],
        [-125, 65], [-40, 55], [45, 65], [130, 80],
        [-85, 120], [0, 105], [85, 115], [145, 95]
    ];
    const photoAngles = [-12, 5, 9, -7, -4, 11, -9, 3, 8, -6, 13, -11, -2, 7, -8, 4];

    floatingPhotos.forEach((photo, index) => {
        photo.classList.add("physics-photo");
        const photoRect = photo.getBoundingClientRect();
        const initialX = galaxy.clientWidth / 2 - photoRect.width / 2 + (centerOffsets[index] ? centerOffsets[index][0] : 0);
        const initialY = galaxy.clientHeight / 2 - photoRect.height / 2 + (centerOffsets[index] ? centerOffsets[index][1] : 0);

        photo.style.left = initialX + "px";
        photo.style.top = initialY + "px";
        photo.style.right = "auto";
        photo.style.bottom = "auto";

        photoMotion.push({
            photo,
            x: initialX,
            y: initialY,
            width: photoRect.width || 145,
            height: photoRect.height || 185,
            velocityX: horizontalDirections[index % horizontalDirections.length] * (0.006 + (index % 4) * 0.002),
            velocityY: verticalDirections[index % verticalDirections.length] * (0.005 + (index % 3) * 0.002),
            angle: photoAngles[index % photoAngles.length],
            angleDirection: index % 2 ? -1 : 1,
            driftPhase: index * 1.7
        });
    });

    let previousTime = performance.now();

    const movePhotos = (currentTime) => {
        const elapsed = Math.min(currentTime - previousTime, 32);
        previousTime = currentTime;
        const galaxyWidth = galaxy.clientWidth;
        const galaxyHeight = galaxy.clientHeight;

        photoMotion.forEach((motion) => {
            motion.x += motion.velocityX * elapsed;
            motion.y += (motion.velocityY + Math.sin(currentTime * 0.00045 + motion.driftPhase) * 0.002) * elapsed;
            motion.x += Math.cos(currentTime * 0.00035 + motion.driftPhase) * 0.002 * elapsed;

            const maxX = galaxyWidth - motion.width;
            const maxY = galaxyHeight - motion.height;

            if (motion.x <= 0 || motion.x >= maxX) {
                motion.x = Math.max(0, Math.min(motion.x, maxX));
                motion.velocityX *= -1;
            }
            if (motion.y <= 0 || motion.y >= maxY) {
                motion.y = Math.max(0, Math.min(motion.y, maxY));
                motion.velocityY *= -1;
            }

            motion.angle += motion.angleDirection * elapsed * 0.006;
            if (motion.angle > 8 || motion.angle < -8) {
                motion.angleDirection *= -1;
            }

            motion.photo.style.left = motion.x + "px";
            motion.photo.style.top = motion.y + "px";
            motion.photo.style.transform = `rotate(${motion.angle}deg)`;
        });

        requestAnimationFrame(movePhotos);
    };

    requestAnimationFrame(movePhotos);
};

/* =====================================================
   ÂM NHẠC (MUSIC PLAYER)
===================================================== */
const songs = [
    {
        title: "Beautiful In White",
        artist: "Shane Filan",
        src: "music/beautiful-in-white-lyrics.mp3",
        image: "images/memory1.jpg"
    }
];

const audioPlayer = document.getElementById("audioPlayer");
const playButton = document.getElementById("playButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const record = document.getElementById("record");
const playlist = document.getElementById("playlist");
const musicMemoryImage = document.getElementById("musicMemoryImage");
let currentSongIndex = 0;

function loadSong(index) {
    if (!songs.length) return;
    currentSongIndex = index;
    const song = songs[currentSongIndex];
    if (songTitle) songTitle.textContent = song.title;
    if (songArtist) songArtist.textContent = song.artist;
    if (audioPlayer) audioPlayer.src = song.src;
    if (musicMemoryImage) musicMemoryImage.src = song.image;
    renderPlaylist();
}

function renderPlaylist() {
    if (!playlist) return;
    playlist.innerHTML = "";
    songs.forEach((song, idx) => {
        const item = document.createElement("div");
        item.className = `song-item ${idx === currentSongIndex ? "active" : ""}`;
        item.innerHTML = `
            <span>❤</span>
            <div>
                <strong>${song.title}</strong>
                <small style="display:block; color:#9d5872;">${song.artist}</small>
            </div>
        `;
        item.addEventListener("click", () => {
            loadSong(idx);
            playSong();
        });
        playlist.appendChild(item);
    });
}

function playSong() {
    if (!audioPlayer) return;
    audioPlayer.play().then(() => {
        if (playButton) playButton.textContent = "⏸";
        if (record) record.classList.add("playing");
    }).catch(() => {});
}

function pauseSong() {
    if (!audioPlayer) return;
    audioPlayer.pause();
    if (playButton) playButton.textContent = "▶";
    if (record) record.classList.remove("playing");
}

if (playButton) {
    playButton.addEventListener("click", function () {
        if (audioPlayer && audioPlayer.paused) {
            playSong();
        } else {
            pauseSong();
        }
    });
}

if (prevButton) {
    prevButton.addEventListener("click", function () {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    });
}

if (nextButton) {
    nextButton.addEventListener("click", function () {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    });
}

if (audioPlayer) {
    audioPlayer.addEventListener("timeupdate", function () {
        if (!audioPlayer.duration) return;
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        if (progressBar) progressBar.value = percent;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    });

    audioPlayer.addEventListener("loadedmetadata", function () {
        if (durationEl) durationEl.textContent = formatTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener("ended", function () {
        if (nextButton) nextButton.click();
    });
}

if (progressBar) {
    progressBar.addEventListener("input", function () {
        if (!audioPlayer || !audioPlayer.duration) return;
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
    });
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
}

loadSong(0);

/* =====================================================
   QUÀ TẶNG & LỜI CẦU HÔN (GIFT BOX & CHOCOLATE)
===================================================== */
const giftBoxArea = document.getElementById("giftBoxArea");
const giftGif = document.getElementById("giftGif");
const giftGifStill = document.getElementById("giftGifStill");
const giftOpenStill = document.getElementById("giftOpenStill");
const giftGifContext = giftGifStill ? giftGifStill.getContext("2d") : null;
const giftContents = document.getElementById("giftContents");
const chocolateGif = document.getElementById("chocolateGif");
const chocolatePopup = document.getElementById("chocolatePopup");
const closeChocolate = document.getElementById("closeChocolate");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const noMessage = document.getElementById("noMessage");
const finalPopup = document.getElementById("finalPopup");
const closeFinal = document.getElementById("closeFinal");
const returnToHomeBtn = document.getElementById("returnToHomeBtn");

let giftOpened = false;
const giftPlaybackDuration = 1100;

function resetGiftPage() {
    giftOpened = false;
    if (giftContents) giftContents.classList.remove("show");
    if (giftGifStill) giftGifStill.style.display = "block";
    if (giftOpenStill) giftOpenStill.style.opacity = "0";
    if (giftGif) {
        giftGif.style.display = "none";
        giftGif.style.opacity = "1";
        giftGif.src = "images/Merry Christmas Gift Sticker by sanne.gif";
    }
    drawGiftFirstFrame();
}

function drawGiftFirstFrame() {
    if (!giftGif || !giftGifStill || !giftGifContext) return;
    giftGifContext.clearRect(0, 0, giftGifStill.width, giftGifStill.height);
    try {
        giftGifContext.drawImage(giftGif, 0, 0, giftGifStill.width, giftGifStill.height);
    } catch (e) {}
}

if (giftGif) {
    giftGif.addEventListener("load", () => { if (!giftOpened) drawGiftFirstFrame(); });
    if (giftGif.complete) drawGiftFirstFrame();
}

if (giftBoxArea) {
    giftBoxArea.addEventListener("click", function () {
        if (giftOpened) return;
        giftOpened = true;
        if (giftGifStill) giftGifStill.style.display = "none";
        if (giftGif) {
            giftGif.style.display = "block";
            giftGif.src = "images/Merry Christmas Gift Sticker by sanne.gif?play=" + Date.now();
        }
        setTimeout(function () {
            if (giftGif) giftGif.style.display = "none";
            if (giftOpenStill) giftOpenStill.style.opacity = "1";
            if (giftContents) giftContents.classList.add("show");
        }, giftPlaybackDuration);
    });
}

if (chocolateGif) {
    chocolateGif.addEventListener("click", function (e) {
        e.stopPropagation();
        if (chocolatePopup) chocolatePopup.classList.add("show");
    });
}

if (closeChocolate) {
    closeChocolate.addEventListener("click", function () {
        if (chocolatePopup) chocolatePopup.classList.remove("show");
    });
}

// Nút Không né chuột
const noMessages = [
    "Ơ? Anh định chọn gì vậy? 😳",
    "Anh suy nghĩ kỹ chưa? 👀",
    "Không được chọn cái này nha 😭",
    "Em không cho anh chọn đâu 😤",
    "Anh chạy đi đâu thì cũng không thoát đâu ❤️"
];
let noClickCount = 0;

function moveNoButton() {
    if (!noButton) return;
    noClickCount++;
    if (noMessage) {
        noMessage.textContent = noMessages[Math.min(noClickCount - 1, noMessages.length - 1)];
    }
    const parent = noButton.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();
    const maxX = Math.max(10, parentRect.width - buttonRect.width - 10);
    const maxY = 70;
    const randomX = Math.random() * maxX;
    const randomY = (Math.random() - 0.5) * maxY;
    noButton.style.transform = `translate(${randomX - 70}px, ${randomY}px)`;
}

if (noButton) {
    noButton.addEventListener("mouseenter", moveNoButton);
    noButton.addEventListener("click", moveNoButton);
}

if (yesButton) {
    yesButton.addEventListener("click", function () {
        if (chocolatePopup) chocolatePopup.classList.remove("show");
        if (finalPopup) finalPopup.classList.add("show");
    });
}

if (closeFinal) {
    closeFinal.addEventListener("click", function () {
        if (finalPopup) finalPopup.classList.remove("show");
        showScreen(endingScreen);
    });
}

if (returnToHomeBtn) {
    returnToHomeBtn.addEventListener("click", function () {
        showScreen(mainAppScreen);
        switchAppPage("homePage");
    });
}

/* =====================================================
   FLOATING SCORE EFFECT & FLOATING TOAST
===================================================== */
function showFloatingScore(text, isPositive) {
    if (!floatingToastContainer) return;
    const bubble = document.createElement("div");
    bubble.className = `floating-score-bubble ${isPositive ? "positive" : "negative"}`;
    bubble.textContent = text;
    floatingToastContainer.appendChild(bubble);

    setTimeout(() => {
        bubble.remove();
    }, 1800);
}

function showFloatingToast(msg) {
    showFloatingScore(msg, true);
}

/* =====================================================
   TẠO HIỆU ỨNG TRÁI TIM BAY NHẸ TRÊN NỀN
===================================================== */
function createBackgroundFloatingHearts() {
    const container = document.getElementById("floatingHeartsBg");
    if (!container) return;
    const heartSymbols = ["❤️", "💖", "💕", "🌸", "✨", "💗"];

    setInterval(() => {
        const heart = document.createElement("span");
        heart.className = "floating-heart-item";
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = 8 + Math.random() * 8 + "s";
        heart.style.fontSize = 14 + Math.random() * 16 + "px";
        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 16000);
    }, 1200);
}

// Quote ngẫu nhiên
function setRandomQuote() {
    const el = document.getElementById("randomQuoteText");
    if (el) {
        el.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
    }
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =====================================================
   KHỞI TẠO ỨNG DỤNG
===================================================== */
window.addEventListener("DOMContentLoaded", async function () {
    await initIndexedDB();
    updateLoveClock();
    setInterval(updateLoveClock, 1000);
    renderMilestones();
    updateLovePointsDisplay();
    renderPointHistory();
    renderLoveNotes();
    await loadAndRenderPolaroidGrid();
    startGalaxyMotion();
    createBackgroundFloatingHearts();
    setRandomQuote();
    updateStorageSummary();
});