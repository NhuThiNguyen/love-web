/* =====================================================
   CÀI ĐẶT
===================================================== */

// ĐỔI MẬT KHẨU Ở ĐÂY
const PASSWORD = "260406";


/* =====================================================
   LẤY ELEMENT
===================================================== */

const introScreen =
    document.getElementById("introScreen");

const passwordScreen =
    document.getElementById("passwordScreen");

const homeScreen =
    document.getElementById("homeScreen");

const endingScreen =
    document.getElementById("endingScreen");


const startButton =
    document.getElementById("startButton");

const beeButton =
    document.getElementById("beeButton");

const continueButton =
    document.getElementById("continueButton");


const passwordDots =
    document.querySelectorAll(
        "#passwordDots span"
    );


const keypadButtons =
    document.querySelectorAll(
        ".number-button[data-number]"
    );


const deleteButton =
    document.getElementById("deleteButton");


const passwordContainer =
    document.querySelector(
        ".password-container"
    );


const wrongPasswordPopup =
    document.getElementById(
        "wrongPasswordPopup"
    );


const correctPasswordPopup =
    document.getElementById(
        "correctPasswordPopup"
    );


let enteredPassword = "";


/* =====================================================
   CHUYỂN SCREEN
===================================================== */

function showScreen(screen) {

    document.querySelectorAll(
        ".screen"
    ).forEach(item => {

        item.classList.remove("active");

    });

    if (!screen) return;

    screen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   TRANG ĐẦU → PASSWORD
===================================================== */

if (startButton) {

    startButton.addEventListener(
        "click",
        function () {

            showScreen(passwordScreen);

        }
    );

}


/* =====================================================
   CON ONG - TRANG BÌA
===================================================== */

if (beeButton) {
    beeButton.addEventListener("click", function () {
        showScreen(passwordScreen);
    });
}


/* =====================================================
   PASSWORD DOT
===================================================== */

function updatePasswordDots() {

    passwordDots.forEach(
        (dot, index) => {

            if (
                index <
                enteredPassword.length
            ) {

                dot.classList.add(
                    "filled"
                );

            } else {

                dot.classList.remove(
                    "filled"
                );

            }

        }
    );
}


/* =====================================================
   KIỂM TRA PASSWORD
===================================================== */

function checkPassword() {

    if (
        enteredPassword.length !==
        PASSWORD.length
    ) {

        return;

    }


    if (
        enteredPassword === PASSWORD
    ) {

        correctPassword();

    } else {

        wrongPassword();

    }

}


/* =====================================================
   SAI PASSWORD
===================================================== */

function wrongPassword() {

    if (passwordContainer) {

        passwordContainer.classList.remove(
            "shake"
        );

        // Reset animation
        void passwordContainer.offsetWidth;

        passwordContainer.classList.add(
            "shake"
        );

    }


    if (wrongPasswordPopup) {

        wrongPasswordPopup.classList.add(
            "show"
        );


        setTimeout(
            function () {

                wrongPasswordPopup.classList.remove(
                    "show"
                );

                enteredPassword = "";

                updatePasswordDots();

            },
            1800
        );

    }

}


/* =====================================================
   ĐÚNG PASSWORD
   + RESET PHÁO HOA
===================================================== */

function correctPassword() {

    if (!correctPasswordPopup) return;


    /*
       Xóa class trước để animation
       pháo hoa có thể chạy lại từ đầu
       mỗi lần nhập đúng mật khẩu.
    */

    correctPasswordPopup.classList.remove(
        "show"
    );


    void correctPasswordPopup.offsetWidth;


    correctPasswordPopup.classList.add(
        "show"
    );

}


/* =====================================================
   ĐI TIẾP SAU KHI ĐÚNG
===================================================== */

if (continueButton) {

    continueButton.addEventListener(
        "click",
        function () {

            if (correctPasswordPopup) {
                correctPasswordPopup.classList.remove(
                    "show"
                );
            }

            enteredPassword = "";
            updatePasswordDots();
            showScreen(homeScreen);

        }
    );

}


/* =====================================================
   NHẬP SỐ
===================================================== */

keypadButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                if (
                    enteredPassword.length >=
                    PASSWORD.length
                ) {

                    return;

                }


                enteredPassword +=
                    button.dataset.number;


                updatePasswordDots();


                if (
                    enteredPassword.length ===
                    PASSWORD.length
                ) {

                    setTimeout(
                        checkPassword,
                        250
                    );

                }

            }
        );

    }
);


/* =====================================================
   XÓA SỐ
===================================================== */

if (deleteButton) {

    deleteButton.addEventListener(
        "click",
        function () {

            enteredPassword = "";

            updatePasswordDots();

        }
    );

}


/* =====================================================
   MENU 4 Ô
===================================================== */

const menuCards =
    document.querySelectorAll(
        ".menu-card"
    );


const subPages =
    document.querySelectorAll(
        ".sub-page"
    );


menuCards.forEach(
    card => {

        card.addEventListener(
            "click",
            function () {

                const pageID =
                    card.dataset.page;


                if (pageID === "giftPage") {
                    resetGiftPage();
                }


                if (homeScreen) {

                    homeScreen.classList.remove(
                        "active"
                    );

                }


                subPages.forEach(
                    page => {

                        page.classList.remove(
                            "active"
                        );

                    }
                );


                const targetPage =
                    document.getElementById(
                        pageID
                    );


                if (targetPage) {

                    targetPage.classList.add(
                        "active"
                    );

                }


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }
);


/* =====================================================
   NÚT QUAY LẠI
===================================================== */

document.querySelectorAll(
    ".back-button"
).forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                subPages.forEach(
                    page => {

                        page.classList.remove(
                            "active"
                        );

                    }
                );


                showScreen(homeScreen);

            }
        );

    }
);


/* =====================================================
   MUSIC
===================================================== */

const songs = [

    {
        title: "Beautiful In White",
        artist: "Shane Filan",
        src: "music/beautiful-in-white-lyrics.mp3",
        file: "music/beautiful-in-white-lyrics.mp3",
        image: "images/memory1.jpg"
    },

    {
        title: "Tên bài nhạc 2",
        artist: "Tên tác giả 2",
        src: "music/bai-2.mp3",
        file: "music/bai-2.mp3",
        image: "images/memory2.jpg"
    },

    {
        title: "Tên bài nhạc 3",
        artist: "Tên tác giả 3",
        src: "music/bai-3.mp3",
        file: "music/bai-3.mp3",
        image: "images/memory3.jpg"
    },

    {
        title: "Tên bài nhạc 4",
        artist: "Tên tác giả 4",
        src: "music/bai-4.mp3",
        file: "music/bai-4.mp3",
        image: "images/memory4.jpg"
    },

    {
        title: "Tên bài nhạc 5",
        artist: "Tên tác giả 5",
        src: "music/bai-5.mp3",
        file: "music/bai-5.mp3",
        image: "images/memory5.jpg"
    },

    {
        title: "Tên bài nhạc 6",
        artist: "Tên tác giả 6",
        src: "music/bai-6.mp3",
        file: "music/bai-6.mp3",
        image: "images/memory6.jpg"
    }

];

// Cách dùng:
// 1. Đặt file mp3 vào thư mục music/
// 2. Thay tên bài, tác giả và đường dẫn src tương ứng ở đây
// Ví dụ:
// { title: "Anh Cứ Đi Đi", artist: "Bức Tường", src: "music/anh-cu-di-di.mp3", file: "music/anh-cu-di-di.mp3", image: "images/memory1.jpg" }


const audioPlayer =
    document.getElementById(
        "audioPlayer"
    );


const playButton =
    document.getElementById(
        "playButton"
    );


const prevButton =
    document.getElementById(
        "prevButton"
    );


const nextButton =
    document.getElementById(
        "nextButton"
    );


const progressBar =
    document.getElementById(
        "progressBar"
    );


const currentTime =
    document.getElementById(
        "currentTime"
    );


const duration =
    document.getElementById(
        "duration"
    );


const songTitle =
    document.getElementById(
        "songTitle"
    );


const songArtist =
    document.getElementById(
        "songArtist"
    );


const record =
    document.getElementById(
        "record"
    );


const playlist =
    document.getElementById(
        "playlist"
    );


const musicMemoryImage =
    document.getElementById(
        "musicMemoryImage"
    );


let currentSong = 0;


/* LOAD SONG */

function loadSong(index) {

    if (!songs.length) return;

    currentSong = index;

    const song =
        songs[currentSong];


    if (songTitle) {

        songTitle.textContent =
            song.title;

    }


    if (songArtist) {

        songArtist.textContent =
            song.artist;

    }


    if (audioPlayer) {

        audioPlayer.src =
            song.src || song.file;

    }


    if (musicMemoryImage) {

        musicMemoryImage.src =
            song.image;

    }


    renderPlaylist();

}


/* PLAYLIST */

function renderPlaylist() {

    if (!playlist) return;


    playlist.innerHTML = "";


    songs.forEach(
        (song, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "song-item";


            if (
                index === currentSong
            ) {

                item.classList.add(
                    "active"
                );

            }


            item.innerHTML = `
                <span class="playlist-heart">❤</span>

                <div class="playlist-text">
                    <strong>
                        ${song.title}
                    </strong>

                    <small>
                        ${song.artist}
                    </small>
                </div>
            `;


            item.addEventListener(
                "click",
                function () {

                    loadSong(index);

                    playSong();

                }
            );


            playlist.appendChild(
                item
            );

        }
    );

}


/* PLAY */

function playSong() {

    if (!audioPlayer) return;


    audioPlayer.play()
        .then(() => {

            if (playButton) {

                playButton.textContent =
                    "⏸";

            }


            if (record) {

                record.classList.add(
                    "playing"
                );

            }

        })
        .catch(() => {

            console.log(
                "Chưa có file nhạc."
            );

        });

}


/* PAUSE */

function pauseSong() {

    if (!audioPlayer) return;


    audioPlayer.pause();


    if (playButton) {

        playButton.textContent =
            "▶";

    }


    if (record) {

        record.classList.remove(
            "playing"
        );

    }

}


/* PLAY BUTTON */

if (playButton) {

    playButton.addEventListener(
        "click",
        function () {

            if (
                audioPlayer &&
                audioPlayer.paused
            ) {

                playSong();

            } else {

                pauseSong();

            }

        }
    );

}


/* NEXT */

if (nextButton) {

    nextButton.addEventListener(
        "click",
        function () {

            currentSong++;


            if (
                currentSong >=
                songs.length
            ) {

                currentSong = 0;

            }


            loadSong(
                currentSong
            );

            playSong();

        }
    );

}


/* PREVIOUS */

if (prevButton) {

    prevButton.addEventListener(
        "click",
        function () {

            currentSong--;


            if (
                currentSong < 0
            ) {

                currentSong =
                    songs.length - 1;

            }


            loadSong(
                currentSong
            );

            playSong();

        }
    );

}


/* AUDIO TIME */

if (audioPlayer) {

    audioPlayer.addEventListener(
        "loadedmetadata",
        function () {

            if (duration) {

                duration.textContent =
                    formatTime(
                        audioPlayer.duration
                    );

            }

        }
    );


    audioPlayer.addEventListener(
        "timeupdate",
        function () {

            if (
                !audioPlayer.duration
            ) {

                return;

            }


            const percent =
                (
                    audioPlayer.currentTime /
                    audioPlayer.duration
                ) * 100;


            if (progressBar) {

                progressBar.value =
                    percent;

            }


            if (currentTime) {

                currentTime.textContent =
                    formatTime(
                        audioPlayer.currentTime
                    );

            }

        }
    );


    audioPlayer.addEventListener(
        "ended",
        function () {

            if (nextButton) {

                nextButton.click();

            }

        }
    );

}


/* PROGRESS */

if (progressBar) {

    progressBar.addEventListener(
        "input",
        function () {

            if (
                !audioPlayer ||
                !audioPlayer.duration
            ) {

                return;

            }


            audioPlayer.currentTime =
                (
                    progressBar.value /
                    100
                ) *
                audioPlayer.duration;

        }
    );

}


/* TIME FORMAT */

function formatTime(seconds) {

    if (
        isNaN(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(secs).padStart(
            2,
            "0"
        )
    );

}


loadSong(0);


/* =====================================================
   GALLERY
===================================================== */

const floatingPhotos =
    document.querySelectorAll(
        ".floating-photo"
    );


const galleryPopup =
    document.getElementById(
        "galleryPopup"
    );


const galleryPopupImage =
    document.getElementById(
        "galleryPopupImage"
    );


const galleryPopupMessage =
    document.getElementById(
        "galleryPopupMessage"
    );


const closeGallery =
    document.getElementById(
        "closeGallery"
    );


floatingPhotos.forEach(
    photo => {

        photo.addEventListener(
            "click",
            function () {

                if (galleryPopupImage) {
                    galleryPopupImage.src =
                        photo.dataset.image;
                }

                if (galleryPopupMessage) {
                    galleryPopupMessage.textContent =
                        photo.dataset.message;
                }

                if (galleryPopup) {
                    galleryPopup.classList.add(
                        "show"
                    );
                }

            }
        );

    }
);


if (closeGallery) {

    closeGallery.addEventListener(
        "click",
        function () {

            galleryPopup.classList.remove(
                "show"
            );

        }
    );

}


if (galleryPopup) {

    galleryPopup.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                galleryPopup
            ) {

                galleryPopup.classList.remove(
                    "show"
                );

            }

        }
    );

}


const galaxy =
    document.querySelector(
        ".galaxy"
    );


const startGalaxyMotion = () => {

    if (!galaxy || !floatingPhotos.length) {
        return;
    }

    if (!galaxy.clientWidth || !galaxy.clientHeight) {
        requestAnimationFrame(
            startGalaxyMotion
        );
        return;
    }

    const photoMotion = [];

    const horizontalDirections = [
        1, -1, 1, -1, -1, 1, -1, 1,
        1, -1, -1, 1, -1, 1, 1, -1
    ];

    const verticalDirections = [
        -1, 1, 1, -1, 1, -1, 1, -1,
        1, 1, -1, -1, 1, -1, -1, 1
    ];

    const centerOffsets = [
        [-130, -105], [-45, -125], [50, -110], [125, -75],
        [-145, -20], [-55, -35], [40, -25], [135, -5],
        [-125, 65], [-40, 55], [45, 65], [130, 80],
        [-85, 120], [0, 105], [85, 115], [145, 95]
    ];

    const photoAngles = [
        -12, 5, 9, -7, -4, 11, -9, 3,
        8, -6, 13, -11, -2, 7, -8, 4
    ];

    floatingPhotos.forEach(
        (photo, index) => {

            photo.classList.add(
                "physics-photo"
            );

            const photoRect =
                photo.getBoundingClientRect();

            const initialX =
                galaxy.clientWidth / 2 -
                photoRect.width / 2 +
                centerOffsets[index][0];

            const initialY =
                galaxy.clientHeight / 2 -
                photoRect.height / 2 +
                centerOffsets[index][1];

            photo.style.left =
                initialX +
                "px";

            photo.style.top =
                initialY +
                "px";

            photo.style.right =
                "auto";

            photo.style.bottom =
                "auto";

            photoMotion.push({
                photo,
                x: initialX,
                y: initialY,
                width: photoRect.width,
                height: photoRect.height,
                velocityX: horizontalDirections[index] *
                    (0.006 + (index % 4) * 0.002),
                velocityY: verticalDirections[index] *
                    (0.005 + (index % 3) * 0.002),
                angle: photoAngles[index],
                angleDirection: index % 2 ? -1 : 1,
                driftPhase: index * 1.7
            });

        }
    );

    let previousTime =
        performance.now();

    const movePhotos =
        currentTime => {

            const elapsed =
                Math.min(
                    currentTime - previousTime,
                    32
                );

            previousTime = currentTime;

            const galaxyWidth =
                galaxy.clientWidth;

            const galaxyHeight =
                galaxy.clientHeight;

            photoMotion.forEach(
                motion => {

                    motion.x +=
                        motion.velocityX * elapsed;

                    motion.y +=
                        (
                            motion.velocityY +
                            Math.sin(
                                currentTime * .00045 +
                                motion.driftPhase
                            ) * .002
                        ) * elapsed;

                    motion.x +=
                        Math.cos(
                            currentTime * .00035 +
                            motion.driftPhase
                        ) * .002 * elapsed;

                    const maxX =
                        galaxyWidth - motion.width;

                    const maxY =
                        galaxyHeight - motion.height;

                    if (motion.x <= 0 || motion.x >= maxX) {
                        motion.x = Math.max(
                            0,
                            Math.min(
                                motion.x,
                                maxX
                            )
                        );
                        motion.velocityX *= -1;
                    }

                    if (motion.y <= 0 || motion.y >= maxY) {
                        motion.y = Math.max(
                            0,
                            Math.min(
                                motion.y,
                                maxY
                            )
                        );
                        motion.velocityY *= -1;
                    }

                    motion.angle +=
                        motion.angleDirection *
                        elapsed * .006;

                    if (motion.angle > 8 || motion.angle < -8) {
                        motion.angleDirection *= -1;
                    }

                    motion.photo.style.left =
                        motion.x + "px";

                    motion.photo.style.top =
                        motion.y + "px";

                    motion.photo.style.transform =
                        "rotate(" + motion.angle + "deg)";

                }
            );

            requestAnimationFrame(
                movePhotos
            );

        };

    requestAnimationFrame(
        movePhotos
    );

};


startGalaxyMotion();


/* =====================================================
   ENVELOPE
===================================================== */

const envelopeArea =
    document.getElementById(
        "envelopeArea"
    );


const envelope =
    document.querySelector(
        ".envelope"
    );


const envelopeHint =
    document.getElementById(
        "envelopeHint"
    );


const letterHearts =
    document.getElementById(
        "letterHearts"
    );


let envelopeOpened = false;


if (envelope) {

    envelope.addEventListener(
        "click",
        function () {

            if (
                envelopeOpened
            ) {

                return;

            }


            envelopeOpened = true;


            envelope.classList.add(
                "open"
            );


            if (envelopeHint) {

                envelopeHint.textContent =
                    "❤️ Một lá thư dành riêng cho anh ❤️";

            }


            setTimeout(
                function () {

                    if (letterHearts) {

                        letterHearts.classList.add(
                            "show"
                        );


                        setTimeout(
                            function () {

                                letterHearts.classList.remove(
                                    "show"
                                );

                            },
                            2000
                        );

                    }

                },
                700
            );

        }
    );

}


/* =====================================================
   GIFT BOX
===================================================== */

const giftBoxArea =
    document.getElementById(
        "giftBoxArea"
    );


const giftBox =
    document.querySelector(
        ".gift-box"
    );


const giftGif =
    document.getElementById(
        "giftGif"
    );


const giftGifStill =
    document.getElementById(
        "giftGifStill"
    );


const giftOpenStill =
    document.getElementById(
        "giftOpenStill"
    );


const giftGifContext = giftGifStill
    ? giftGifStill.getContext("2d")
    : null;


const giftContents =
    document.getElementById(
        "giftContents"
    );


let giftOpened = false;
const giftPlaybackDuration = 1100;


function resetGiftPage() {

    giftOpened = false;

    if (giftContents) {
        giftContents.classList.remove("show");
    }

    if (giftGifStill) {
        giftGifStill.style.display = "block";
    }

    if (giftOpenStill) {
        giftOpenStill.style.opacity = "0";
    }

    if (giftGif) {
        giftGif.style.display = "none";
        giftGif.style.opacity = "1";
        giftGif.src = "images/Merry Christmas Gift Sticker by sanne.gif";
    }

    if (giftGif && giftGif.complete) {
        drawGiftFirstFrame();
    }

}


function drawGiftFirstFrame() {

    if (!giftGif || !giftGifStill || !giftGifContext) {
        return;
    }

    giftGifContext.clearRect(
        0,
        0,
        giftGifStill.width,
        giftGifStill.height
    );

    giftGifContext.drawImage(
        giftGif,
        0,
        0,
        giftGifStill.width,
        giftGifStill.height
    );

}


function showGiftContents() {

    if (giftGif) {
        giftGif.style.display = "none";
    }

    if (giftGifStill) {
        giftGifStill.style.display = "none";
    }

    if (giftOpenStill) {
        giftOpenStill.style.opacity = "1";
    }

    if (giftContents) {
        setTimeout(function () {
            giftContents.classList.add("show");
        }, 80);
    }

}


if (giftGif) {

    giftGif.addEventListener(
        "load",
        function () {
            if (!giftOpened) {
                drawGiftFirstFrame();
            }
        }
    );

    if (giftGif.complete) {
        drawGiftFirstFrame();
    }

}


if (giftBoxArea) {

    giftBoxArea.addEventListener(
        "click",
        function () {

            if (giftOpened) {
                return;
            }

            giftOpened = true;

            if (giftGifStill) {
                giftGifStill.style.display = "none";
            }

            if (giftGif) {
                giftGif.style.display = "block";
                giftGif.src =
                    "images/Merry Christmas Gift Sticker by sanne.gif?play=" +
                    Date.now();
            }

            setTimeout(
                showGiftContents,
                giftPlaybackDuration
            );

        }
    );

}


/* =====================================================
   CHOCOLATE
===================================================== */

const chocolateGif =
    document.getElementById(
        "chocolateGif"
    );


const chocolatePopup =
    document.getElementById(
        "chocolatePopup"
    );


const closeChocolate =
    document.getElementById(
        "closeChocolate"
    );


if (chocolateGif) {

    chocolateGif.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            if (chocolatePopup) {

                chocolatePopup.classList.add(
                    "show"
                );

            }

        }
    );

}


if (closeChocolate) {

    closeChocolate.addEventListener(
        "click",
        function () {

            if (chocolatePopup) {

                chocolatePopup.classList.remove(
                    "show"
                );

            }

        }
    );

}


/* =====================================================
   NÚT KHÔNG CHẠY
===================================================== */

const noButton =
    document.getElementById(
        "noButton"
    );


const noMessage =
    document.getElementById(
        "noMessage"
    );


let noClickCount = 0;


const noMessages = [

    "Ơ? Anh định chọn gì vậy? 😳",

    "Anh suy nghĩ kỹ chưa? 👀",

    "Không được chọn cái này nha 😭",

    "Em không cho anh chọn đâu 😤",

    "Anh chạy đi đâu thì cũng không thoát đâu ❤️"

];


function moveNoButton() {

    if (!noButton) return;


    noClickCount++;


    if (noMessage) {

        noMessage.textContent =
            noMessages[
                Math.min(
                    noClickCount - 1,
                    noMessages.length - 1
                )
            ];

    }


    const parent =
        noButton.parentElement;


    if (!parent) return;


    const parentRect =
        parent.getBoundingClientRect();


    const buttonRect =
        noButton.getBoundingClientRect();


    const maxX =
        Math.max(
            10,
            parentRect.width -
            buttonRect.width -
            10
        );


    const maxY = 80;


    const randomX =
        Math.random() * maxX;


    const randomY =
        (Math.random() - .5) *
        maxY;


    noButton.style.transform =
        `translate(${randomX - 80}px, ${randomY}px)`;

}


if (noButton) {

    noButton.addEventListener(
        "mouseenter",
        moveNoButton
    );


    noButton.addEventListener(
        "click",
        moveNoButton
    );

}


/* =====================================================
   NÚT CÓ
===================================================== */

const yesButton =
    document.getElementById(
        "yesButton"
    );


const finalPopup =
    document.getElementById(
        "finalPopup"
    );


const finalGif =
    document.querySelector(
        "#finalPopup .final-gif"
    );


let finalGifLoop;


function restartFinalGif() {

    if (!finalGif) return;


    const gifSource =
        finalGif.src;


    finalGif.src = "";

    requestAnimationFrame(
        function () {

            finalGif.src = gifSource;

        }
    );

}


function startFinalGifLoop() {

    restartFinalGif();

    clearInterval(finalGifLoop);

    finalGifLoop = setInterval(
        restartFinalGif,
        4000
    );

}


function stopFinalGifLoop() {

    clearInterval(finalGifLoop);

}


const closeFinal =
    document.getElementById(
        "closeFinal"
    );


if (yesButton) {

    yesButton.addEventListener(
        "click",
        function () {

            if (chocolatePopup) {
                chocolatePopup.classList.remove("show");
            }

            if (finalPopup) {
                finalPopup.classList.add("show");
                startFinalGifLoop();
            }

        }
    );

}


/* =====================================================
   ENDING
===================================================== */

if (closeFinal) {

    closeFinal.addEventListener(
        "click",
        function () {

            if (finalPopup) {

                finalPopup.classList.remove(
                    "show"
                );

                stopFinalGifLoop();

            }


            document.querySelectorAll(
                ".sub-page"
            ).forEach(
                page => {

                    page.classList.remove(
                        "active"
                    );

                }
            );


            if (endingScreen) {

                endingScreen.classList.add(
                    "active"
                );

            }


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}