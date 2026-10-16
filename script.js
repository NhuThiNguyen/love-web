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
    const activeUserId = typeof getActiveUserId === "function" ? getActiveUserId() : "user1";
    const authorName = activeUserId === "user2" ? "Anh" : "Như";
    const authorLabel = author || (activeUserId === "user2" ? "Anh gửi Em" : "Em gửi Anh");
    const newNote = {
        id: Date.now(),
        author: authorLabel,
        authorId: activeUserId,
        text: text.trim(),
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toLocaleDateString("vi-VN")
    };
    notes.unshift(newNote);
    localStorage.setItem("LOVE_NOTES", JSON.stringify(notes));
    renderLoveNotes();
    triggerAutoSave();
    if (typeof logCoupleActivity === "function") {
        logCoupleActivity(activeUserId, `vừa gửi một lời yêu thương: "${text.trim().slice(0, 35)}${text.trim().length > 35 ? '...' : ''}"`, "note");
    }
    if (typeof broadcastRealtimeMessage === "function") {
        broadcastRealtimeMessage({
            type: "NOTE_SENT",
            actor: activeUserId,
            payload: newNote
        });
    }
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
            const photoObj = photos.find((p) => p.id === id);
            const activeUser = typeof getActiveUserId === "function" ? getActiveUserId() : "user1";
            if (photoObj && photoObj.uploadedBy && photoObj.uploadedBy !== activeUser) {
                alert("Chỉ người đã đăng bức ảnh này mới có quyền xóa nhé! 💕");
                return;
            }
            const confirmDel = confirm("Anh/em có chắc muốn xóa bức ảnh kỷ niệm này không?");
            if (!confirmDel) return;

            await dbDeletePhoto(id);
            if (typeof logCoupleActivity === "function") {
                logCoupleActivity(activeUser, `vừa xóa một bức ảnh kỷ niệm`, "photo_delete");
            }
            if (typeof broadcastRealtimeMessage === "function") {
                broadcastRealtimeMessage({
                    type: "PHOTO_DELETE",
                    actor: activeUser,
                    payload: { id }
                });
            }
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

        const activeUserId = typeof getActiveUserId === "function" ? getActiveUserId() : "user1";

        const newPhoto = {
            id: "photo-" + Date.now(),
            src: currentUploadBase64,
            caption: caption,
            date: dateVal,
            timestamp: Date.now(),
            uploadedBy: activeUserId,
            reactions: { love: 0, cute: 0, happy: 0, funny: 0, userReactions: {} },
            comments: []
        };

        await dbSavePhoto(newPhoto);
        triggerAutoSave();
        if (typeof logCoupleActivity === "function") {
            logCoupleActivity(activeUserId, `vừa đăng một bức ảnh mới: "${caption.slice(0, 30)}"`, "photo");
        }
        if (typeof broadcastRealtimeMessage === "function") {
            broadcastRealtimeMessage({
                type: "PHOTO_UPLOAD",
                actor: activeUserId,
                payload: newPhoto
            });
        }
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

    const authorBadge = document.getElementById("lightboxAuthorBadge");
    const authorName = photo.uploadedBy === "user2" ? "Người yêu (Anh)" : "Như";
    if (authorBadge) authorBadge.textContent = `Đăng bởi ${authorName}`;

    const deleteBtn = document.getElementById("lightboxDeletePhotoBtn");
    if (deleteBtn) {
        deleteBtn.onclick = async function (e) {
            e.stopPropagation();
            const activeUser = typeof getActiveUserId === "function" ? getActiveUserId() : "user1";
            if (photo.uploadedBy && photo.uploadedBy !== activeUser) {
                alert("Chỉ người đã đăng bức ảnh này mới có quyền xóa nhé! 💕");
                return;
            }
            if (!confirm("Anh/em có chắc muốn xóa bức ảnh này không?")) return;
            await dbDeletePhoto(photo.id);
            if (typeof logCoupleActivity === "function") {
                logCoupleActivity(activeUser, `vừa xóa một bức ảnh kỷ niệm`, "photo_delete");
            }
            if (typeof broadcastRealtimeMessage === "function") {
                broadcastRealtimeMessage({
                    type: "PHOTO_DELETE",
                    actor: activeUser,
                    payload: { id: photo.id }
                });
            }
            triggerAutoSave();
            if (galleryPopup) galleryPopup.classList.remove("show");
            await loadAndRenderPolaroidGrid();
            showFloatingToast("🗑️ Đã xóa ảnh");
        };
    }

    if (typeof renderLightboxReactions === "function") {
        renderLightboxReactions(photo);
    }
    if (typeof renderLightboxComments === "function") {
        renderLightboxComments(photo);
    }
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
   MỤC 12: HỆ THỐNG TƯƠNG TÁC GIỮA HAI NGƯỜI
===================================================== */

const COUPLE_USERS = {
    user1: {
        id: "user1",
        name: "Như",
        roleName: "Như (Em)",
        shortName: "Như",
        avatar: "images/totnghiep.jpg",
        partnerId: "user2"
    },
    user2: {
        id: "user2",
        name: "Người yêu",
        roleName: "Người yêu (Anh)",
        shortName: "Anh",
        avatar: "images/cty.jpg",
        partnerId: "user1"
    }
};

const myClientId = "love_client_" + Math.random().toString(36).substring(2, 9);
let mqttClient = null;
let broadcastChannel = null;
let lastPartnerHeartbeat = 0;
let partnerOnlineState = false;

// Lấy user đang hoạt động
function getActiveUserId() {
    return localStorage.getItem("COUPLE_ACTIVE_USER") || "user1";
}

function getActiveUser() {
    const id = getActiveUserId();
    return COUPLE_USERS[id] || COUPLE_USERS.user1;
}

function getPartnerUser() {
    const id = getActiveUserId();
    const partnerId = id === "user1" ? "user2" : "user1";
    return COUPLE_USERS[partnerId];
}

function switchActiveUser() {
    const currentId = getActiveUserId();
    const newId = currentId === "user1" ? "user2" : "user1";
    localStorage.setItem("COUPLE_ACTIVE_USER", newId);
    updateCoupleUserUI();

    const newUser = COUPLE_USERS[newId];
    showFloatingToast(`🔄 Bạn đang sử dụng tư cách: ${newUser.roleName}`);
    logCoupleActivity(newId, `vừa chuyển sang thiết bị này`, "switch");
    broadcastRealtimeMessage({
        type: "USER_SWITCH",
        actor: newId,
        actorName: newUser.name
    });
}

// Cập nhật giao diện Couple User
function updateCoupleUserUI() {
    const activeId = getActiveUserId();
    const activeUser = getActiveUser();
    const partner = getPartnerUser();

    const avatarUser1Wrap = document.getElementById("avatarUser1Wrap");
    const avatarUser2Wrap = document.getElementById("avatarUser2Wrap");
    const currentUserBadge = document.getElementById("currentUserBadge");
    const storageCurrentIdentity = document.getElementById("storageCurrentIdentity");
    const giftPointPartnerName = document.getElementById("giftPointPartnerName");

    if (avatarUser1Wrap && avatarUser2Wrap) {
        if (activeId === "user1") {
            avatarUser1Wrap.classList.add("active");
            avatarUser2Wrap.classList.remove("active");
        } else {
            avatarUser2Wrap.classList.add("active");
            avatarUser1Wrap.classList.remove("active");
        }
    }

    if (currentUserBadge) {
        currentUserBadge.textContent = `Bạn: ${activeUser.roleName}`;
    }
    if (storageCurrentIdentity) {
        storageCurrentIdentity.textContent = `${activeId === "user1" ? "👩" : "👨"} ${activeUser.roleName}`;
    }
    if (giftPointPartnerName) {
        giftPointPartnerName.textContent = `Gửi tặng điểm và lời nhắn ngọt ngào tới ${partner.roleName}`;
    }
}

// Room Code
function getCoupleRoomCode() {
    return localStorage.getItem("COUPLE_ROOM_CODE") || "LOVE-2026";
}

function setCoupleRoomCode(code) {
    const clean = (code || "LOVE-2026").trim().toUpperCase();
    localStorage.setItem("COUPLE_ROOM_CODE", clean);
    const input = document.getElementById("currentRoomCodeInput");
    if (input) input.value = clean;
    initRealtimeConnection();
    showFloatingToast(`🔗 Đã tham gia không gian: ${clean}`);
}

// Realtime Engine (MQTT + BroadcastChannel)
function initRealtimeConnection() {
    // 1. BroadcastChannel (cho cùng trình duyệt/đa tab/kiểm thử nội bộ)
    try {
        if (typeof BroadcastChannel !== "undefined") {
            if (broadcastChannel) broadcastChannel.close();
            broadcastChannel = new BroadcastChannel("LOVE_SPACE_CHANNEL_" + getCoupleRoomCode());
            broadcastChannel.onmessage = function (event) {
                handleIncomingRealtimeMessage(event.data);
            };
        }
    } catch (e) {
        console.warn("BroadcastChannel error:", e);
    }

    // 2. MQTT over WebSocket (Đồng bộ đa thiết bị tức thì qua Internet)
    const connBadge = document.getElementById("realtimeConnectionBadge");
    if (connBadge) {
        connBadge.className = "connection-status-pill connecting";
        connBadge.textContent = "🟡 Đang kết nối...";
    }

    if (typeof mqtt !== "undefined") {
        try {
            if (mqttClient) {
                mqttClient.end(true);
            }
            const room = getCoupleRoomCode();
            const topic = `love_space/${room}/sync`;

            // Kết nối EMQX WebSocket công cộng miễn phí (cực kỳ ổn định và nhanh)
            mqttClient = mqtt.connect("wss://broker.emqx.io:8084/mqtt", {
                clientId: myClientId,
                clean: true,
                connectTimeout: 8000,
                reconnectPeriod: 4000
            });

            mqttClient.on("connect", function () {
                if (connBadge) {
                    connBadge.className = "connection-status-pill connected";
                    connBadge.textContent = "🟢 Đang đồng bộ";
                }
                mqttClient.subscribe(topic, { qos: 0 });
                // Gửi Ping thông báo hiện diện ngay khi kết nối
                sendPresencePing();
            });

            mqttClient.on("message", function (top, payload) {
                try {
                    const msg = JSON.parse(payload.toString());
                    handleIncomingRealtimeMessage(msg);
                } catch (err) {
                    console.error("MQTT parse error:", err);
                }
            });

            mqttClient.on("error", function () {
                if (connBadge) {
                    connBadge.className = "connection-status-pill offline";
                    connBadge.textContent = "⚪ Ngoại tuyến (Đã bật Broadcast)";
                }
            });
        } catch (e) {
            console.warn("MQTT connect exception:", e);
        }
    }
}

// Gửi tin nhắn đồng bộ qua mọi kênh
function broadcastRealtimeMessage(msg) {
    msg.senderClientId = myClientId;
    msg.room = getCoupleRoomCode();
    msg.timestamp = Date.now();

    // Qua BroadcastChannel
    if (broadcastChannel) {
        try {
            broadcastChannel.postMessage(msg);
        } catch (e) {}
    }

    // Qua MQTT
    if (mqttClient && mqttClient.connected) {
        try {
            const topic = `love_space/${getCoupleRoomCode()}/sync`;
            mqttClient.publish(topic, JSON.stringify(msg), { qos: 0 });
        } catch (e) {}
    }
}

// Tiếp nhận tin nhắn đồng bộ
async function handleIncomingRealtimeMessage(msg) {
    if (!msg || msg.senderClientId === myClientId) return;

    const actor = msg.actor;
    const actorUser = COUPLE_USERS[actor] || { name: "Người yêu", avatar: "images/totnghiep.jpg" };

    switch (msg.type) {
        case "PING":
            lastPartnerHeartbeat = Date.now();
            updatePartnerOnlineUI(true);
            // Trả lời PONG để người kia biết mình cũng đang online
            broadcastRealtimeMessage({
                type: "PONG",
                actor: getActiveUserId()
            });
            break;

        case "PONG":
            lastPartnerHeartbeat = Date.now();
            updatePartnerOnlineUI(true);
            break;

        case "POINT_GIFT": {
            const gift = msg.payload || {};
            const amount = gift.amount || 0;
            const currentPoints = getLovePoints() + amount;
            localStorage.setItem("LOVE_POINTS", currentPoints);
            updateLovePointsDisplay();

            // Lưu lịch sử
            const history = getPointHistory();
            history.unshift({
                id: Date.now(),
                amount: amount,
                reason: `Được tặng: ${gift.message || "Quà yêu thương"}`,
                time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                date: new Date().toLocaleDateString("vi-VN")
            });
            localStorage.setItem("LOVE_POINT_HISTORY", JSON.stringify(history));
            renderPointHistory();

            logCoupleActivity(actor, `vừa tặng bạn ${amount > 0 ? "+" : ""}${amount} điểm tình yêu`, "point_gift", gift.message);
            showPartnerRealtimeToast("🎁", `${actorUser.name} đã tặng bạn ${amount > 0 ? "+" : ""}${amount} điểm!`, gift.message || "Yêu em/anh nhiều ❤️", actorUser.avatar);
            break;
        }

        case "PHOTO_UPLOAD": {
            const photo = msg.payload;
            if (photo) {
                await dbSavePhoto(photo);
                await loadAndRenderPolaroidGrid();
                logCoupleActivity(actor, `vừa đăng một bức ảnh mới: "${photo.caption || ''}"`, "photo");
                showPartnerRealtimeToast("📸", `${actorUser.name} vừa đăng ảnh mới!`, photo.caption || "Một khoảnh khắc mới trong Album", actorUser.avatar);
            }
            break;
        }

        case "PHOTO_REACTION": {
            const { photoId, reactionKey, user } = msg.payload || {};
            await applyRemotePhotoReaction(photoId, reactionKey, user);
            showPartnerRealtimeToast("❤️", `${actorUser.name} vừa thả cảm xúc!`, `Đã bày tỏ cảm xúc cho bức ảnh kỷ niệm`, actorUser.avatar);
            break;
        }

        case "PHOTO_COMMENT": {
            const { photoId, comment } = msg.payload || {};
            await applyRemotePhotoComment(photoId, comment);
            showPartnerRealtimeToast("💬", `${actorUser.name} đã bình luận:`, comment.text, actorUser.avatar);
            break;
        }

        case "PHOTO_DELETE": {
            const { id } = msg.payload || {};
            if (id) {
                await dbDeletePhoto(id);
                await loadAndRenderPolaroidGrid();
                if (galleryPopup && galleryPopup.classList.contains("show")) {
                    galleryPopup.classList.remove("show");
                }
            }
            break;
        }

        case "NOTE_SENT": {
            const note = msg.payload;
            if (note) {
                const notes = getLoveNotes();
                notes.unshift(note);
                localStorage.setItem("LOVE_NOTES", JSON.stringify(notes));
                renderLoveNotes();
                logCoupleActivity(actor, `vừa gửi một lời yêu thương: "${note.text.slice(0, 30)}..."`, "note");
                showPartnerRealtimeToast("💌", `${actorUser.name} vừa gửi lời yêu thương!`, note.text, actorUser.avatar);
            }
            break;
        }

        case "MEMORY_ADDED": {
            const mem = msg.payload;
            if (mem) {
                const memories = getCoupleMemories();
                memories.unshift(mem);
                localStorage.setItem("COUPLE_MEMORIES", JSON.stringify(memories));
                renderCoupleMemories();
                logCoupleActivity(actor, `vừa thêm kỷ niệm: "${mem.title}"`, "memory");
                showPartnerRealtimeToast("📖", `${actorUser.name} thêm kỷ niệm mới!`, mem.title, actorUser.avatar);
            }
            break;
        }

        case "MEMORY_DELETED": {
            const { id } = msg.payload || {};
            if (id) {
                let memories = getCoupleMemories();
                memories = memories.filter((m) => m.id !== id);
                localStorage.setItem("COUPLE_MEMORIES", JSON.stringify(memories));
                renderCoupleMemories();
            }
            break;
        }

        case "START_DATE_CHANGE": {
            const { date } = msg.payload || {};
            if (date) {
                localStorage.setItem("LOVE_START_DATE", date);
                updateLoveClock();
                showPartnerRealtimeToast("📅", `${actorUser.name} cập nhật ngày yêu!`, `Ngày bắt đầu mới: ${date}`, actorUser.avatar);
            }
            break;
        }

        case "USER_SWITCH":
            updateCoupleUserUI();
            break;
    }
}

// Presence Heartbeat
function sendPresencePing() {
    broadcastRealtimeMessage({
        type: "PING",
        actor: getActiveUserId()
    });
}

function updatePartnerOnlineUI(isOnline) {
    partnerOnlineState = isOnline;
    const partner = getPartnerUser();
    const partnerOnlineStatus = document.getElementById("partnerOnlineStatus");
    const partnerPresencePill = document.getElementById("partnerPresencePill");
    const activityOnlineText = document.getElementById("activityOnlineText");
    const activityOnlinePill = document.getElementById("activityOnlinePill");

    const text = isOnline
        ? `<span class="status-dot online"></span> ${partner.shortName} đang online`
        : `<span class="status-dot offline"></span> ${partner.shortName} vừa hoạt động`;

    if (partnerOnlineStatus) partnerOnlineStatus.innerHTML = text;
    if (partnerPresencePill) {
        partnerPresencePill.innerHTML = isOnline
            ? `🟢 ${partner.shortName} đang online`
            : `⚪ ${partner.shortName} ngoại tuyến`;
    }
    if (activityOnlineText) {
        activityOnlineText.textContent = isOnline
            ? `${partner.shortName} đang online cùng bạn`
            : `Đồng bộ trực tuyến phòng ${getCoupleRoomCode()}`;
    }
    if (activityOnlinePill) {
        if (isOnline) {
            activityOnlinePill.classList.add("partner-active");
        } else {
            activityOnlinePill.classList.remove("partner-active");
        }
    }
}

function checkPartnerHeartbeat() {
    const now = Date.now();
    const diff = now - lastPartnerHeartbeat;
    if (diff > 65000) {
        updatePartnerOnlineUI(false);
    }
}

// Âm thanh thông báo ngọt ngào (Web Audio API Synthesizer)
function playMelodyNotification() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.36);
    } catch (e) {}
}

// Toast thông báo trực tiếp người yêu (Mục 12.7)
function showPartnerRealtimeToast(icon, title, desc, avatarSrc) {
    playMelodyNotification();
    const container = document.getElementById("realtimeNotificationContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "realtime-toast";
    toast.innerHTML = `
        <img src="${avatarSrc || 'images/totnghiep.jpg'}" alt="Avatar" class="toast-avatar">
        <div class="toast-body">
            <div class="toast-title">${icon} ${escapeHtml(title)}</div>
            <div class="toast-desc">${escapeHtml(desc || '')}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-hiding");
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}

/* =====================================================
   HOẠT ĐỘNG CHUNG (MỤC 12.4)
===================================================== */
function getCoupleActivities() {
    try {
        const raw = localStorage.getItem("COUPLE_ACTIVITIES");
        return raw ? JSON.parse(raw) : [
            {
                id: 1,
                actor: "user1",
                text: "Như vừa đăng một bức ảnh mới vào Album",
                type: "photo",
                timestamp: Date.now() - 1000 * 60 * 2
            },
            {
                id: 2,
                actor: "user2",
                text: "Người yêu vừa cộng 50 điểm tình yêu",
                type: "point_gift",
                extra: "Thưởng vì hôm nay em ngoan",
                timestamp: Date.now() - 1000 * 60 * 10
            },
            {
                id: 3,
                actor: "user1",
                text: "Như vừa gửi một lời yêu thương",
                type: "note",
                extra: "Anh nhớ uống nhiều nước nhé!",
                timestamp: Date.now() - 1000 * 60 * 30
            }
        ];
    } catch (e) {
        return [];
    }
}

function logCoupleActivity(actorId, actionText, type = "heart", extraDetail = "") {
    const list = getCoupleActivities();
    const actorUser = COUPLE_USERS[actorId] || { name: "Người ấy" };
    const item = {
        id: Date.now(),
        actor: actorId,
        text: `${actorUser.name} ${actionText}`,
        type,
        extra: extraDetail,
        timestamp: Date.now()
    };
    list.unshift(item);
    if (list.length > 80) list.pop();
    localStorage.setItem("COUPLE_ACTIVITIES", JSON.stringify(list));
    renderCoupleActivities();
}

function formatRelativeTime(ts) {
    if (!ts) return "Vừa xong";
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    const d = new Date(ts);
    return `${d.toLocaleDateString("vi-VN")} lúc ${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
}

function getActivityIcon(type) {
    switch (type) {
        case "photo": return "📸";
        case "photo_delete": return "🗑️";
        case "point_gift":
        case "point_plus": return "🎁";
        case "point_minus": return "💔";
        case "note": return "💌";
        case "memory": return "📖";
        case "reaction": return "❤️";
        case "comment": return "💬";
        case "switch": return "🔄";
        case "date": return "📅";
        default: return "💕";
    }
}

function renderCoupleActivities() {
    const listEl = document.getElementById("activityTimelineList");
    if (!listEl) return;
    const activities = getCoupleActivities();
    listEl.innerHTML = "";

    if (activities.length === 0) {
        listEl.innerHTML = `
            <div style="text-align:center; color:#9d5872; padding:30px;">
                Chưa có hoạt động nào được ghi lại. Hãy bắt đầu tương tác với nhau nhé ❤️
            </div>
        `;
        return;
    }

    activities.forEach((act) => {
        const item = document.createElement("div");
        item.className = "activity-card-item";
        item.innerHTML = `
            <div class="activity-icon-bubble">${getActivityIcon(act.type)}</div>
            <div class="activity-content-wrap">
                <div class="activity-main-text">${escapeHtml(act.text)}</div>
                ${act.extra ? `<div class="activity-extra-detail">${escapeHtml(act.extra)}</div>` : ''}
                <div class="activity-timestamp">${formatRelativeTime(act.timestamp)}</div>
            </div>
        `;
        listEl.appendChild(item);
    });
}

/* =====================================================
   KỶ NIỆM CỦA CHÚNG MÌNH (MỤC 12.11)
===================================================== */
const DEFAULT_MEMORIES = [
    {
        id: "mem-1",
        title: "Chuyến đi Đà Lạt đầu tiên",
        date: "2024-05-15",
        location: "Hồ Xuân Hương, Đà Lạt",
        emotion: "🥰 Hạnh phúc",
        story: "Cùng nhau thức dậy sớm ngắm bình minh giữa sương mù lành lạnh. Anh nắm tay em đi bộ quanh hồ, khoảnh khắc ấy em ước thời gian ngừng trôi mãi mãi...",
        imageSrc: "images/cty.jpg",
        author: "user1",
        timestamp: 1715731200000
    },
    {
        id: "mem-2",
        title: "Ngày tốt nghiệp cùng nhau",
        date: "2024-04-26",
        location: "Hội trường trường",
        emotion: "✨ Đáng nhớ",
        story: "Ngày khép lại một chặng đường thanh xuân và mở ra tương lai rạng rỡ của hai đứa mình. Cảm ơn anh đã luôn là chỗ dựa vững chãi cho em!",
        imageSrc: "images/totnghiep.jpg",
        author: "user2",
        timestamp: 1714089600000
    }
];

function getCoupleMemories() {
    try {
        const raw = localStorage.getItem("COUPLE_MEMORIES");
        return raw ? JSON.parse(raw) : DEFAULT_MEMORIES;
    } catch (e) {
        return DEFAULT_MEMORIES;
    }
}

function renderCoupleMemories() {
    const grid = document.getElementById("memoriesGrid");
    const countBadge = document.getElementById("memoriesCountBadge");
    if (!grid) return;

    const memories = getCoupleMemories();
    if (countBadge) countBadge.textContent = `${memories.length} kỷ niệm`;
    grid.innerHTML = "";

    if (memories.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; color:#9d5872; padding:40px;">
                Chưa có kỷ niệm nào. Nhấn "+ Thêm kỷ niệm mới" để lưu giữ chuyến đi đầu tiên nhé! ❤️
            </div>
        `;
        return;
    }

    memories.forEach((mem) => {
        const card = document.createElement("div");
        card.className = "memory-timeline-card";
        const authorName = mem.author === "user2" ? "Anh" : "Như";

        card.innerHTML = `
            <div class="memory-cover-wrap">
                <img src="${mem.imageSrc || 'images/totnghiep.jpg'}" alt="${escapeHtml(mem.title)}">
            </div>
            <div class="memory-card-body">
                <div class="memory-meta-badges">
                    <span class="mem-badge mem-badge-date">📅 ${mem.date || ''}</span>
                    <span class="mem-badge mem-badge-location">📍 ${escapeHtml(mem.location || 'Bên nhau')}</span>
                    <span class="mem-badge mem-badge-emotion">${escapeHtml(mem.emotion || '🥰')}</span>
                </div>
                <h3 class="memory-card-title">${escapeHtml(mem.title)}</h3>
                <p class="memory-card-story">${escapeHtml(mem.story || '')}</p>
                <div class="memory-card-footer">
                    <span>Được tạo bởi: <strong class="memory-author-tag">${authorName}</strong></span>
                    <button class="memory-delete-btn" data-id="${mem.id}" title="Xóa kỷ niệm này">🗑️ Xóa</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Xóa kỷ niệm
    grid.querySelectorAll(".memory-delete-btn").forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            const id = this.dataset.id;
            const confirmDel = confirm("Anh/em có chắc muốn xóa kỷ niệm này không?");
            if (!confirmDel) return;

            let memories = getCoupleMemories();
            memories = memories.filter((m) => m.id !== id);
            localStorage.setItem("COUPLE_MEMORIES", JSON.stringify(memories));
            renderCoupleMemories();
            broadcastRealtimeMessage({
                type: "MEMORY_DELETED",
                actor: getActiveUserId(),
                payload: { id }
            });
            showFloatingToast("🗑️ Đã xóa kỷ niệm");
        });
    });
}

// Modal Thêm Kỷ Niệm
let memoryUploadBase64 = "";
function initMemoryModal() {
    const openBtn = document.getElementById("openAddMemoryBtn");
    const modal = document.getElementById("addMemoryModal");
    const closeBtn = document.getElementById("closeAddMemoryModalBtn");
    const saveBtn = document.getElementById("saveMemoryBtn");
    const fileInput = document.getElementById("memoryFileInput");
    const dropEmpty = document.getElementById("memoryDropEmpty");
    const dropPreview = document.getElementById("memoryDropPreview");
    const previewImg = document.getElementById("memoryPreviewImg");
    const removePreview = document.getElementById("removeMemoryPreviewBtn");

    const titleInput = document.getElementById("memoryTitleInput");
    const dateInput = document.getElementById("memoryDateInput");
    const locationInput = document.getElementById("memoryLocationInput");
    const storyInput = document.getElementById("memoryStoryInput");

    if (openBtn && modal) {
        openBtn.addEventListener("click", () => {
            modal.classList.add("show");
            if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => modal.classList.remove("show"));
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.remove("show");
        });
    }

    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (evt) {
                compressImage(evt.target.result, 1200, 1200, 0.82, function (compressed) {
                    memoryUploadBase64 = compressed;
                    if (previewImg) previewImg.src = compressed;
                    if (dropEmpty) dropEmpty.style.display = "none";
                    if (dropPreview) dropPreview.style.display = "block";
                });
            };
            reader.readAsDataURL(file);
        });
    }

    if (removePreview) {
        removePreview.addEventListener("click", () => {
            memoryUploadBase64 = "";
            if (fileInput) fileInput.value = "";
            if (dropEmpty) dropEmpty.style.display = "block";
            if (dropPreview) dropPreview.style.display = "none";
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            const title = titleInput ? titleInput.value.trim() : "";
            if (!title) {
                alert("Vui lòng nhập tiêu đề kỷ niệm nhé ❤️");
                return;
            }
            const dateVal = dateInput ? dateInput.value : "";
            const location = locationInput ? locationInput.value.trim() : "";
            const story = storyInput ? storyInput.value.trim() : "";
            const emotionRadio = document.querySelector('input[name="memoryEmotion"]:checked');
            const emotion = emotionRadio ? emotionRadio.value : "🥰 Hạnh phúc";

            const activeUser = getActiveUserId();
            const newMem = {
                id: "mem-" + Date.now(),
                title,
                date: dateVal,
                location: location || "Bên nhau",
                emotion,
                story,
                imageSrc: memoryUploadBase64 || "images/cty.jpg",
                author: activeUser,
                timestamp: Date.now()
            };

            const memories = getCoupleMemories();
            memories.unshift(newMem);
            localStorage.setItem("COUPLE_MEMORIES", JSON.stringify(memories));
            renderCoupleMemories();

            logCoupleActivity(activeUser, `vừa ghi dấu một kỷ niệm mới: "${title}"`, "memory");
            broadcastRealtimeMessage({
                type: "MEMORY_ADDED",
                actor: activeUser,
                payload: newMem
            });

            if (modal) modal.classList.remove("show");
            if (titleInput) titleInput.value = "";
            if (locationInput) locationInput.value = "";
            if (storyInput) storyInput.value = "";
            if (removePreview) removePreview.click();
            showFloatingToast("📖 Đã thêm kỷ niệm mới thành công!");
        });
    }
}

/* =====================================================
   TƯƠNG TÁC TRÊN ẢNH: REACTION & COMMENTS (MỤC 12.10)
===================================================== */
function renderLightboxReactions(photo) {
    if (!photo) return;
    photo.reactions = photo.reactions || { love: 0, cute: 0, happy: 0, funny: 0, userReactions: {} };
    photo.reactions.userReactions = photo.reactions.userReactions || {};

    const activeUser = getActiveUserId();
    const myCurrentReaction = photo.reactions.userReactions[activeUser];

    const countLove = document.getElementById("countReactionLove");
    const countCute = document.getElementById("countReactionCute");
    const countHappy = document.getElementById("countReactionHappy");
    const countFunny = document.getElementById("countReactionFunny");

    if (countLove) countLove.textContent = photo.reactions.love || 0;
    if (countCute) countCute.textContent = photo.reactions.cute || 0;
    if (countHappy) countHappy.textContent = photo.reactions.happy || 0;
    if (countFunny) countFunny.textContent = photo.reactions.funny || 0;

    document.querySelectorAll(".btn-photo-reaction").forEach((btn) => {
        const rKey = btn.dataset.reaction;
        if (myCurrentReaction === rKey) {
            btn.classList.add("reacted");
        } else {
            btn.classList.remove("reacted");
        }

        btn.onclick = async function () {
            await handleReactionClick(photo, rKey);
        };
    });
}

async function handleReactionClick(photo, reactionKey) {
    const activeUser = getActiveUserId();
    photo.reactions = photo.reactions || { love: 0, cute: 0, happy: 0, funny: 0, userReactions: {} };
    photo.reactions.userReactions = photo.reactions.userReactions || {};

    const prev = photo.reactions.userReactions[activeUser];

    if (prev === reactionKey) {
        // Hủy reaction
        delete photo.reactions.userReactions[activeUser];
        photo.reactions[reactionKey] = Math.max(0, (photo.reactions[reactionKey] || 1) - 1);
    } else {
        if (prev) {
            photo.reactions[prev] = Math.max(0, (photo.reactions[prev] || 1) - 1);
        }
        photo.reactions.userReactions[activeUser] = reactionKey;
        photo.reactions[reactionKey] = (photo.reactions[reactionKey] || 0) + 1;

        const reactionIcons = { love: "❤️", cute: "💕", happy: "🥰", funny: "😂" };
        showFloatingScore(`${reactionIcons[reactionKey] || '❤️'} Thả cảm xúc`, true);
        logCoupleActivity(activeUser, `vừa thả ${reactionIcons[reactionKey]} cho bức ảnh: "${photo.caption || ''}"`, "reaction");
    }

    await dbSavePhoto(photo);
    renderLightboxReactions(photo);
    broadcastRealtimeMessage({
        type: "PHOTO_REACTION",
        actor: activeUser,
        payload: {
            photoId: photo.id,
            reactionKey: photo.reactions.userReactions[activeUser] || null,
            user: activeUser
        }
    });
}

async function applyRemotePhotoReaction(photoId, reactionKey, user) {
    const photos = await dbGetAllPhotos();
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;

    photo.reactions = photo.reactions || { love: 0, cute: 0, happy: 0, funny: 0, userReactions: {} };
    photo.reactions.userReactions = photo.reactions.userReactions || {};

    const prev = photo.reactions.userReactions[user];
    if (prev) {
        photo.reactions[prev] = Math.max(0, (photo.reactions[prev] || 1) - 1);
    }
    if (reactionKey) {
        photo.reactions.userReactions[user] = reactionKey;
        photo.reactions[reactionKey] = (photo.reactions[reactionKey] || 0) + 1;
    } else {
        delete photo.reactions.userReactions[user];
    }

    await dbSavePhoto(photo);
    if (currentPhotoList[currentLightboxIndex] && currentPhotoList[currentLightboxIndex].id === photoId) {
        currentPhotoList[currentLightboxIndex] = photo;
        renderLightboxReactions(photo);
    }
}

// Comments trên ảnh
function renderLightboxComments(photo) {
    const listEl = document.getElementById("photoCommentsList");
    const countEl = document.getElementById("photoCommentsCount");
    const inputEl = document.getElementById("photoCommentInput");
    const sendBtn = document.getElementById("sendPhotoCommentBtn");

    if (!listEl) return;
    photo.comments = photo.comments || [];
    if (countEl) countEl.textContent = photo.comments.length;
    listEl.innerHTML = "";

    if (photo.comments.length === 0) {
        listEl.innerHTML = `<div style="font-size:12px; color:#999; text-align:center; padding:6px;">Chưa có bình luận nào. Hãy là người đầu tiên để lại lời nhắn nhé!</div>`;
    } else {
        photo.comments.forEach((c) => {
            const row = document.createElement("div");
            row.className = "photo-comment-item";
            row.innerHTML = `
                <span class="photo-comment-author">${escapeHtml(c.authorName)}:</span>
                <span>${escapeHtml(c.text)}</span>
                <span class="photo-comment-time">${formatRelativeTime(c.timestamp)}</span>
            `;
            listEl.appendChild(row);
        });
        listEl.scrollTop = listEl.scrollHeight;
    }

    if (sendBtn && inputEl) {
        sendBtn.onclick = async function () {
            const text = inputEl.value.trim();
            if (!text) return;

            const activeUser = getActiveUserId();
            const activeUserInfo = getActiveUser();
            const newComment = {
                id: Date.now(),
                authorId: activeUser,
                authorName: activeUserInfo.roleName,
                text,
                timestamp: Date.now()
            };

            photo.comments.push(newComment);
            await dbSavePhoto(photo);
            renderLightboxComments(photo);
            inputEl.value = "";

            logCoupleActivity(activeUser, `vừa bình luận vào bức ảnh: "${text}"`, "comment");
            broadcastRealtimeMessage({
                type: "PHOTO_COMMENT",
                actor: activeUser,
                payload: {
                    photoId: photo.id,
                    comment: newComment
                }
            });
            showFloatingToast("💬 Đã đăng bình luận!");
        };

        inputEl.onkeydown = function (e) {
            if (e.key === "Enter") {
                sendBtn.click();
            }
        };
    }
}

async function applyRemotePhotoComment(photoId, comment) {
    const photos = await dbGetAllPhotos();
    const photo = photos.find((p) => p.id === photoId);
    if (!photo || !comment) return;

    photo.comments = photo.comments || [];
    photo.comments.push(comment);
    await dbSavePhoto(photo);

    if (currentPhotoList[currentLightboxIndex] && currentPhotoList[currentLightboxIndex].id === photoId) {
        currentPhotoList[currentLightboxIndex] = photo;
        renderLightboxComments(photo);
    }
}

/* =====================================================
   TƯƠNG TÁC ĐIỂM TÌNH YÊU (TẶNG ĐIỂM - MỤC 12.5)
===================================================== */
function initPointGiftingSystem() {
    const sendBtn = document.getElementById("sendGiftPointsBtn");
    const customAmountInput = document.getElementById("customGiftAmount");
    const messageInput = document.getElementById("giftMessageInput");

    document.querySelectorAll(".btn-gift-preset").forEach((btn) => {
        btn.addEventListener("click", function () {
            const val = parseInt(this.dataset.gift, 10);
            if (customAmountInput) customAmountInput.value = val;
        });
    });

    if (sendBtn) {
        sendBtn.addEventListener("click", function () {
            const amount = customAmountInput ? parseInt(customAmountInput.value, 10) : 50;
            if (isNaN(amount) || amount === 0) {
                alert("Vui lòng chọn hoặc nhập số điểm hợp lệ!");
                return;
            }
            const note = messageInput ? messageInput.value.trim() : "";
            const activeUser = getActiveUserId();
            const partner = getPartnerUser();

            // Cập nhật điểm chung
            let current = getLovePoints();
            current += amount;
            localStorage.setItem("LOVE_POINTS", current);

            // Lưu lịch sử
            const history = getPointHistory();
            const reason = note ? `Tặng ${partner.shortName}: ${note}` : `Tặng ${partner.shortName} điểm yêu thương`;
            history.unshift({
                id: Date.now(),
                amount,
                reason,
                time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                date: new Date().toLocaleDateString("vi-VN")
            });
            localStorage.setItem("LOVE_POINT_HISTORY", JSON.stringify(history));

            updateLovePointsDisplay();
            renderPointHistory();
            triggerAutoSave();

            const prefix = amount > 0 ? "+" : "";
            showFloatingScore(`🎁 Đã tặng ${prefix}${amount} điểm!`, amount > 0);

            logCoupleActivity(activeUser, `vừa tặng ${partner.shortName} ${prefix}${amount} điểm tình yêu`, "point_gift", note);
            broadcastRealtimeMessage({
                type: "POINT_GIFT",
                actor: activeUser,
                payload: {
                    amount,
                    message: note
                }
            });

            if (messageInput) messageInput.value = "";
        });
    }
}

/* =====================================================
   ROOM CONNECTION & PROFILE CONTROLS (MỤC 12.2)
===================================================== */
function initCoupleRoomControls() {
    // Copy code button
    const copyBtn = document.getElementById("copyRoomCodeBtn");
    const roomInput = document.getElementById("currentRoomCodeInput");
    if (copyBtn && roomInput) {
        roomInput.value = getCoupleRoomCode();
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(roomInput.value).then(() => {
                showFloatingToast(`📋 Đã sao chép mã phòng: ${roomInput.value}`);
            }).catch(() => {
                roomInput.select();
                document.execCommand("copy");
                showFloatingToast(`📋 Đã sao chép mã phòng!`);
            });
        });
    }

    // Join room button
    const joinBtn = document.getElementById("joinRoomBtn");
    const joinInput = document.getElementById("joinRoomCodeInput");
    if (joinBtn && joinInput) {
        joinBtn.addEventListener("click", () => {
            const code = joinInput.value.trim();
            if (!code) {
                alert("Vui lòng nhập mã phòng!");
                return;
            }
            setCoupleRoomCode(code);
            joinInput.value = "";
        });
    }

    // Switch user buttons
    const sidebarSwitch = document.getElementById("switchUserBtn");
    const storageSwitch = document.getElementById("storageSwitchUserBtn");
    if (sidebarSwitch) sidebarSwitch.addEventListener("click", switchActiveUser);
    if (storageSwitch) storageSwitch.addEventListener("click", switchActiveUser);

    const avatarUser1Wrap = document.getElementById("avatarUser1Wrap");
    const avatarUser2Wrap = document.getElementById("avatarUser2Wrap");
    if (avatarUser1Wrap) avatarUser1Wrap.addEventListener("click", () => {
        if (getActiveUserId() !== "user1") switchActiveUser();
    });
    if (avatarUser2Wrap) avatarUser2Wrap.addEventListener("click", () => {
        if (getActiveUserId() !== "user2") switchActiveUser();
    });
}

/* =====================================================
   KHỞI TẠO TOÀN DIỆN MỤC 12
===================================================== */
function initCoupleInteractionSystem() {
    updateCoupleUserUI();
    initCoupleRoomControls();
    initRealtimeConnection();
    renderCoupleActivities();
    renderCoupleMemories();
    initMemoryModal();
    initPointGiftingSystem();

    const clearActBtn = document.getElementById("clearActivityHistoryBtn");
    if (clearActBtn) {
        clearActBtn.addEventListener("click", () => {
            if (confirm("Anh/em có muốn xóa danh sách hoạt động cũ không?")) {
                localStorage.setItem("COUPLE_ACTIVITIES", JSON.stringify([]));
                renderCoupleActivities();
                showFloatingToast("🧹 Đã dọn dẹp lịch sử hoạt động");
            }
        });
    }

    // Heartbeat định kỳ
    setInterval(sendPresencePing, 25000);
    setInterval(checkPartnerHeartbeat, 10000);
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

    // Khởi tạo hệ thống tương tác giữa hai người (Mục 12)
    initCoupleInteractionSystem();
});