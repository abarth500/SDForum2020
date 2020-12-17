let videosLabo = {};
let videosFaculty = {};
let playerLabo = {};
let playerFaculty = {};
let opened = {};
const name = "システムデザインフォーラム2020";
const title = {
    "sd": "システムデザイン学部 - " + name + " @東京都立大学",
    "cs": "情報科学科 - " + name + " @東京都立大学システムデザイン学部",
    "eecs": "電子情報システム工学科 - " + name + " @東京都立大学システムデザイン学部",
    "mech": "機械システム工学科 - " + name + " @東京都立大学システムデザイン学部",
    "aerospace": "航空宇宙システム工学科 - " + name + " @東京都立大学システムデザイン学部",
    "industrialart": "インダストリアルアート学科 - " + name + " @東京都立大学システムデザイン学部",
};
let ready = false;
let originURL = location.protocol + '//' + location.hostname + (location.port != "" ? ":" + location.port : "");
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    console.log("onYouTubeIframeAPIReady");

    fetch(videoJson)
        .then(response => response.json())
        .then(data => {
            videosLabo = data.depertment;
            videosFaculty = data.faculty;
            /*
            const shuffle = (array) => {
                for (let i = array.length - 1; i >= 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }*/
            let animeHeader = { "header": null, "drawer": null, up: null };
            const showHeader = (show) => {
                if (!show) {
                    if (document.querySelector("#header").getAttribute("x-hide") != "yes" &&
                        document.querySelector("#header").getAttribute("x-position") != "hide") {
                        document.querySelector("#header").setAttribute("x-hide", "yes");
                        if (animeHeader.header != null) { animeHeader.header.pause(); }
                        animeHeader.header = anime({
                            duration: 1000,
                            targets: '#header',
                            opacity: [1, 0],
                            display: ["block", "none"],
                            complete: () => {
                                animeHeader.header = null;
                                document.querySelector("#header").setAttribute("x-hide", "no");
                                document.querySelector("#header").setAttribute("x-position", "hide");
                            }
                        });
                        if (animeHeader.drawer != null) { animeHeader.drawer.pause(); }
                        animeHeader.drawer = anime({
                            duration: 900,
                            targets: '.drawer',
                            opacity: [1, 0],
                            display: ["block", "none"],
                            complete: () => {
                                animeHeader.drawer = null;
                            }
                        });
                        if (animeHeader.up != null) { animeHeader.up.pause(); }
                        animeHeader.up = anime({
                            duration: 900,
                            targets: '.circle',
                            opacity: [0, 1],
                            display: ["none", "block"],
                            complete: () => {
                                animeHeader.up = null;
                            }
                        });
                    }
                } else {
                    if (document.querySelector("#header").getAttribute("x-show") != "yes" &&
                        document.querySelector("#header").getAttribute("x-position") != "show") {
                        document.querySelector("#header").setAttribute("x-show", "yes");
                        if (animeHeader.header != null) { animeHeader.header.pause(); }
                        animeHeader.header = anime({
                            duration: 1000,
                            targets: '#header',
                            opacity: [0, 1],
                            display: ["none", "block"],
                            complete: () => {
                                animeHeader.header = null;
                                document.querySelector("#header").setAttribute("x-show", "no");
                                document.querySelector("#header").setAttribute("x-position", "show");
                            }
                        });
                        if (animeHeader.drawer != null) { animeHeader.drawer.pause(); }
                        animeHeader.drawer = anime({
                            duration: 900,
                            targets: '.drawer',
                            opacity: [0, 1],
                            display: ["none", "block"],
                            complete: () => {
                                animeHeader.drawer = null;
                            }
                        });
                        if (animeHeader.up != null) { animeHeader.up.pause(); }
                        animeHeader.up = anime({
                            duration: 900,
                            targets: '.circle',
                            opacity: [1, 0],
                            display: ["block", "none"],
                            complete: () => {
                                animeHeader.up = null;
                            }
                        });
                    }
                }
            }
            const newPage = (faculty) => {
                let pageid = faculty.split("-");
                let pagetitle = title[pageid[0]];
                history.pushState('', '', "#" + faculty);
                document.title = pagetitle;
                if (pageid.length > 1) {
                    pagetitle = "[" + pageid[1] + "] " + title[pageid[0]];
                }
                console.log(title, "PAGE", pageid[0], pagetitle);
                /*
                if (typeof gtag != "undefined") {
                    gtag('config', 'UA-2590074-2', {
                        'page_title': pagetitle,
                        'page_path': location.href
                    });
                }
                */

            };
            const pauseAllVideo = (ignoreID = false) => {
                Object.keys(playerFaculty).forEach((faculty) => {
                    if (typeof playerFaculty[faculty].pauseVideo == 'function' && ignoreID != faculty) {
                        playerFaculty[faculty].pauseVideo();
                    }
                });
                Object.keys(playerLabo).forEach((id) => {
                    if (typeof playerLabo[id].pauseVideo == 'function' && ignoreID != id) {
                        playerLabo[id].pauseVideo();
                    }
                });
            };
            const showLaboVideo = (faculty) => {
                /* shuffle(videosLabo[faculty]) */
                videosLabo[faculty].forEach((v) => {
                    if (v.youtube == "") { return; }
                    let tpl = document.getElementById('card-template').querySelector('ui').cloneNode(true);
                    tpl.querySelector('.labo-video').setAttribute("x-video-id", v.youtube);
                    const iframe = document.createElement("div");
                    iframe.id = v.youtube;
                    tpl.querySelector('.labo-video').appendChild(iframe);
                    tpl.querySelector('.labo-video svg image').setAttributeNS('http://www.w3.org/1999/xlink', 'href', "https://img.youtube.com/vi/" + v.youtube + "/maxresdefault.jpg");
                    let eles = tpl.querySelectorAll('.labo-video svg *');
                    eles.forEach((ele) => {
                        if (ele.id) {
                            ele.id = ele.id.replace("_SVG_", v.youtube);
                        }
                        if (ele.getAttributeNS('http://www.w3.org/1999/xlink', 'href')) {
                            ele.setAttributeNS('http://www.w3.org/1999/xlink', 'href', ele.getAttributeNS('http://www.w3.org/1999/xlink', 'href').replace("_SVG_", v.youtube));
                        }
                        if (ele.getAttribute('filter')) {
                            ele.setAttribute('filter', ele.getAttribute('filter').replace("_SVG_", v.youtube));
                        }
                        if (ele.getAttribute('clip-path')) {
                            ele.setAttribute('clip-path', ele.getAttribute('clip-path').replace("_SVG_", v.youtube));
                        }
                    });
                    let gBlur = null;
                    tpl.querySelector('.labo-video').addEventListener('mouseenter', e => {
                        e.stopPropagation();
                        const id = e.currentTarget.getAttribute("x-video-id");
                        //e.currentTarget.querySelector("svg #background" + id + " feGaussianBlur").setAttribute("stdDeviation", "15");
                        if (gBlur != null) { gBlur.pause(); }
                        gBlur = anime({
                            targets: "svg #background" + id + " feGaussianBlur",
                            stdDeviation: 30,
                            duration: 10000,
                            complete: () => { gBlur = null; }
                        });
                        e.currentTarget.querySelector("svg #blur" + id + " feFlood").setAttribute("flood-opacity", "1");
                    });
                    tpl.querySelector('.labo-video').addEventListener('mouseleave', e => {
                        e.stopPropagation();
                        const id = e.currentTarget.getAttribute("x-video-id");
                        //e.currentTarget.querySelector("svg #background" + id + " feGaussianBlur").setAttribute("stdDeviation", "0");
                        if (gBlur != null) { gBlur.pause(); }
                        gBlur = anime({
                            targets: "svg #background" + id + " feGaussianBlur",
                            stdDeviation: 0,
                            duration: 5000,
                            complete: () => { gBlur = null; }
                        });
                        e.currentTarget.querySelector("svg #blur" + id + " feFlood").setAttribute("flood-opacity", "0.65");
                    });
                    tpl.querySelector('.labo-video').addEventListener('click', (e) => {
                        e.stopPropagation();
                        const id = e.currentTarget.getAttribute("x-video-id");
                        if (!playerLabo.hasOwnProperty(id)) {
                            const originURL = location.protocol + '//' + location.hostname + (location.port != "" ? ":" + location.port : "");
                            playerLabo[id] = new YT.Player(id, {
                                videoId: id,
                                width: "600px",
                                playerVars: {
                                    rel: 0,
                                    'enablejsapi': 1,
                                    'origin': originURL
                                },
                                events: {
                                    'onReady': (evt) => {
                                        evt.target.playVideo();
                                    },
                                    'onStateChange': (evt) => {
                                        if (evt.data == 1) {
                                            pauseAllVideo(id);
                                        }
                                    }
                                }
                            });
                        }
                    });
                    tpl.querySelector('.labo-name').innerText = v.name;
                    tpl.querySelector('.labo-position').innerText = v.position;
                    tpl.querySelector('.labo-title').innerText = v.title;
                    tpl.querySelector('.labo-keyword').innerText = v.keyword;
                    if (v.picture == "") {
                        const dammyFace = document.createElement("i");
                        dammyFace.classList.add("fas");
                        dammyFace.classList.add("fa-users");
                        dammyFace.classList.add("labo-face");
                        tpl.querySelector('img.labo-face').after(dammyFace);
                        tpl.querySelector('img.labo-face').style.display = "none";
                    } else {
                        tpl.querySelector('.labo-face').src = v.picture;
                    }
                    document.querySelector('section.' + faculty + ' ul.labos').appendChild(tpl);
                });
                if (window.scrollY > 0) {
                    showHeader(false);
                } else {
                    showHeader(true);
                }
                document.getElementById("bg").classList.add("removed");

            }
            const showVideo = (faculty, ignoreLaboVideo = false, callback = function () { }) => {
                document.querySelectorAll('.menuitem').forEach((ele) => { ele.classList.add('kurukuru') });
                let originURL = location.protocol + '//' + location.hostname + (location.port != "" ? ":" + location.port : "");
                playerFaculty[faculty] = new YT.Player('player_' + faculty, {
                    videoId: videosFaculty[faculty],
                    width: "600px",
                    playerVars: {
                        rel: 0,
                        'enablejsapi': 1,
                        'origin': originURL
                    }, events: {
                        'onReady': () => {
                            document.querySelectorAll('.menuitem').forEach((ele) => { ele.classList.remove('kurukuru') });
                            if (!ignoreLaboVideo && !opened.hasOwnProperty(faculty) && videosLabo.hasOwnProperty(faculty)) {
                                showLaboVideo(faculty);
                                opened[faculty] = true;
                            }else{
                                document.getElementById("bg").classList.add("removed");
                            }
                            callback();
                        },
                        'onStateChange': (evt) => {
                            if (evt.data == 1) {
                                pauseAllVideo(faculty);
                            }
                        }
                    }
                });
            }
            document.querySelector('.circle').addEventListener('click', (e) => {
                e.stopPropagation();
                const $window = window.document.scrollingElement || window.document.body || window.document.documentElement;
                anime({
                    targets: { scroll: $window.scrollTop },
                    scroll: 0,
                    duration: 1000,
                    easing: 'easeInOutQuart',
                    update: (a) => {
                        $window.scrollTop = a.animations[0].currentValue;
                    }
                });
            });
            document.querySelector('.video').addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelector('#mode').checked = !document.querySelector('#mode').checked;
                Object.keys(videosFaculty).forEach((faculty) => {
                    if (document.querySelector('.videoselector.' + faculty).checked) {
                        if (document.querySelector('#mode').checked) {
                            playerFaculty[faculty].pauseVideo();
                        } else {
                            pauseAllVideo();
                            playerFaculty[faculty].playVideo();
                        }
                    }
                });
            }, false);
            window.addEventListener('popstate', function (e) {
                const urlHush = location.hash.replace(/^\#/, '');
                const newFaculty = (location.hash == "" || location.hash == "#") ? "sd" : (urlHush.split("-"))[0];
                document.querySelector('.' + newFaculty + '[type=radio]').checked = true;
                pauseAllVideo();
                if (!opened.hasOwnProperty(newFaculty) && videosLabo.hasOwnProperty(newFaculty)) {
                    showLaboVideo(newFaculty);
                    opened[newFaculty] = true;
                }
                document.querySelector('.' + newFaculty + '[type=radio]').checked = true;
            });
            document.querySelectorAll('.menuitem').forEach((ele) => {
                ele.addEventListener('click', function (e) {
                    e.stopPropagation();
                    let faculty = this.getAttribute('x-item');
                    newPage(faculty);
                    if (!opened.hasOwnProperty(faculty) && videosLabo.hasOwnProperty(faculty)) {
                        showLaboVideo(faculty);
                        opened[faculty] = true;
                    }
                    document.querySelector('.' + faculty + '[type=radio]').checked = true;
                    pauseAllVideo();
                });
            }, false);
            window.addEventListener("scroll", function (e) {
                e.stopPropagation();
                if (window.scrollY > 0) {
                    showHeader(false);
                } else if (window.scrollY == 0) {
                    showHeader(true);
                }
            });

            const urlHush = location.hash.replace(/^\#/, '');
            const defFaculty = (location.hash == "" || location.hash == "#") ? "sd" : (urlHush.split("-"))[0];
            document.querySelector('.' + defFaculty + '[type=radio]').checked = true;
            showVideo(defFaculty, false, () => {
                Object.keys(videosFaculty).forEach((faculty) => {
                    if (defFaculty != faculty) {
                        showVideo(faculty, true);
                    }
                });
            });
            newPage(defFaculty);
            ready = true;
        });

}