/**
 * @typedef {{ partner1: string, partner2: string }} CoupleNames
 * @typedef {{ hour: number, minute: number }} EventClock
 * @typedef {{ year: number, month: number, day: number, clock: EventClock }} EventDateParts
 * @typedef {{ timeLabel: string, title: string, description: string }} ScheduleItem
 * @typedef {{ name: string, mapEmbedUrl: string }} Venue
 * @typedef {{ telHref: string, label: string }} RsvpPhone
 */

/**
 * Central configuration — edit values here (see README for map embed and audio).
 * @type {{
 *   coupleNames: CoupleNames,
 *   heroImageSrc: string,
 *   heroInvitationText: string,
 *   eventDate: EventDateParts,
 *   heroDateDisplayHy: string,
 *   storyParagraphs: string[],
 *   scheduleItems: ScheduleItem[],
 *   venues: Venue[],
 *   rsvpPhone: RsvpPhone,
 *   audioSrc: string | null
 * }}
 */
const INVITATION_CONFIG = {
    coupleNames: {
        partner1: "Էդգար",
        partner2: "Լաուրա"
    },
    heroImageSrc: "assets/images/hero.jpg",
    heroInvitationText:
        "Սիրով հրավիրում ենք մասնակցելու մեր հարսանիքին։ Ուրախ կլինենք եթե այս օրը անցկացնեք մեզ հետ",
    eventDate: {
        year: 2026,
        month: 6,
        day: 5,
        clock: { hour: 15, minute: 0 }
    },
    heroDateDisplayHy: "Հունիսի 5, 2026 — ժամը 15:00",
    storyParagraphs: [
        "Այս տեքստը փոխարինեք Ձեր պատմությամբ։ Կարող եք ավելացնել կամ հանել պարբերություններ `storyParagraphs` զանգվածից։",
        "Երկրորդ պարբերություն՝ ըստ ցանկության։"
    ],
    scheduleItems: [
        {
            timeLabel: "15:00",
            title: "Հանդիսություն",
            description: "Տեղ՝ լրացրեք վայրը։"
        },
        {
            timeLabel: "18:00",
            title: "Ճաշ",
            description: "Մանրամասները՝ ըստ ցանկության։"
        }
    ],
    venues: [
        {
            name: "Միջոցառման վայր 1 (փոխարինեք անունը)",
            mapEmbedUrl:
                "https://www.openstreetmap.org/export/embed.html?bbox=44.5014%2C40.1776%2C44.5186%2C40.1876&layer=mapnik&marker=40.1814%2C44.5146"
        },
        {
            name: "Միջոցառման վայր 2 (փոխարինեք անունը)",
            mapEmbedUrl:
                "https://www.openstreetmap.org/export/embed.html?bbox=44.48%2C40.165%2C44.52%2C40.195&layer=mapnik"
        }
    ],
    rsvpPhone: {
        telHref: "tel:+37400000000",
        label: "Զանգահարել (+374 …)"
    },
    audioSrc: null
};

/**
 * @param {unknown} value
 * @param {string} fieldName
 * @returns {asserts value is string}
 */
function assertNonEmptyString(value, fieldName) {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`INVITATION_CONFIG: "${fieldName}" must be a non-empty string.`);
    }
}

/**
 * @param {unknown} value
 * @param {string} fieldName
 * @returns {asserts value is number}
 */
function assertFiniteNumber(value, fieldName) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error(`INVITATION_CONFIG: "${fieldName}" must be a finite number.`);
    }
}

/**
 * @param {CoupleNames} names
 */
function validateCoupleNames(names) {
    assertNonEmptyString(names.partner1, "coupleNames.partner1");
    assertNonEmptyString(names.partner2, "coupleNames.partner2");
}

/**
 * @param {EventDateParts} eventDate
 * @returns {Date}
 */
function buildEventTargetDate(eventDate) {
    assertFiniteNumber(eventDate.year, "eventDate.year");
    assertFiniteNumber(eventDate.month, "eventDate.month");
    assertFiniteNumber(eventDate.day, "eventDate.day");
    assertFiniteNumber(eventDate.clock.hour, "eventDate.clock.hour");
    assertFiniteNumber(eventDate.clock.minute, "eventDate.clock.minute");

    if (eventDate.month < 1 || eventDate.month > 12) {
        throw new Error("INVITATION_CONFIG: eventDate.month must be 1–12.");
    }
    if (eventDate.day < 1 || eventDate.day > 31) {
        throw new Error("INVITATION_CONFIG: eventDate.day must be 1–31.");
    }
    if (eventDate.clock.hour < 0 || eventDate.clock.hour > 23) {
        throw new Error("INVITATION_CONFIG: eventDate.clock.hour must be 0–23.");
    }
    if (eventDate.clock.minute < 0 || eventDate.clock.minute > 59) {
        throw new Error("INVITATION_CONFIG: eventDate.clock.minute must be 0–59.");
    }

    return new Date(
        eventDate.year,
        eventDate.month - 1,
        eventDate.day,
        eventDate.clock.hour,
        eventDate.clock.minute,
        0,
        0
    );
}

/**
 * @param {ScheduleItem[]} items
 */
function validateScheduleItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("INVITATION_CONFIG: scheduleItems must be a non-empty array.");
    }
    items.forEach((item, index) => {
        assertNonEmptyString(item.timeLabel, `scheduleItems[${index}].timeLabel`);
        assertNonEmptyString(item.title, `scheduleItems[${index}].title`);
        assertNonEmptyString(item.description, `scheduleItems[${index}].description`);
    });
}

/**
 * @param {Venue[]} venues
 */
function validateVenues(venues) {
    if (!Array.isArray(venues) || venues.length === 0) {
        throw new Error("INVITATION_CONFIG: venues must be a non-empty array.");
    }
    venues.forEach((venue, index) => {
        assertNonEmptyString(venue.name, `venues[${index}].name`);
        assertNonEmptyString(venue.mapEmbedUrl, `venues[${index}].mapEmbedUrl`);
        if (!venue.mapEmbedUrl.startsWith("https://")) {
            throw new Error(
                `INVITATION_CONFIG: venues[${index}].mapEmbedUrl must be an https embed URL.`
            );
        }
    });
}

/**
 * @param {RsvpPhone} phone
 */
function validateRsvpPhone(phone) {
    assertNonEmptyString(phone.telHref, "rsvpPhone.telHref");
    assertNonEmptyString(phone.label, "rsvpPhone.label");
    if (!phone.telHref.startsWith("tel:")) {
        throw new Error('INVITATION_CONFIG: rsvpPhone.telHref must start with "tel:".');
    }
}

/**
 * @param {string[]} paragraphs
 */
function validateStoryParagraphs(paragraphs) {
    if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
        throw new Error("INVITATION_CONFIG: storyParagraphs must be a non-empty array.");
    }
    paragraphs.forEach((p, index) => {
        assertNonEmptyString(p, `storyParagraphs[${index}]`);
    });
}

/**
 * @param {string | null} audioSrc
 */
function validateOptionalAudioSrc(audioSrc) {
    if (audioSrc === null) {
        return;
    }
    if (typeof audioSrc !== "string" || audioSrc.trim().length === 0) {
        throw new Error('INVITATION_CONFIG: audioSrc must be null or a non-empty string path.');
    }
}

/**
 * @param {typeof INVITATION_CONFIG} config
 */
function validateInvitationConfig(config) {
    validateCoupleNames(config.coupleNames);
    assertNonEmptyString(config.heroImageSrc, "heroImageSrc");
    assertNonEmptyString(config.heroInvitationText, "heroInvitationText");
    assertNonEmptyString(config.heroDateDisplayHy, "heroDateDisplayHy");
    validateStoryParagraphs(config.storyParagraphs);
    validateScheduleItems(config.scheduleItems);
    validateVenues(config.venues);
    validateRsvpPhone(config.rsvpPhone);
    validateOptionalAudioSrc(config.audioSrc);
}

/**
 * @param {number} value
 * @returns {string}
 */
function padTwoDigits(value) {
    return String(Math.max(0, Math.floor(value))).padStart(2, "0");
}

/**
 * @param {Date} targetDate
 */
function startCountdown(targetDate) {
    const elDays = document.getElementById("cd-days");
    const elHours = document.getElementById("cd-hours");
    const elMinutes = document.getElementById("cd-minutes");
    const elSeconds = document.getElementById("cd-seconds");

    if (!elDays || !elHours || !elMinutes || !elSeconds) {
        throw new Error("Countdown: required DOM nodes are missing.");
    }

    const tick = () => {
        const now = Date.now();
        const end = targetDate.getTime();
        const diffMs = end - now;

        if (diffMs <= 0) {
            elDays.textContent = "00";
            elHours.textContent = "00";
            elMinutes.textContent = "00";
            elSeconds.textContent = "00";
            return;
        }

        const totalSeconds = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        elDays.textContent = padTwoDigits(days);
        elHours.textContent = padTwoDigits(hours);
        elMinutes.textContent = padTwoDigits(minutes);
        elSeconds.textContent = padTwoDigits(seconds);
    };

    tick();
    window.setInterval(tick, 1000);
}

/**
 * @param {string[]} paragraphs
 */
function renderStory(paragraphs) {
    const root = document.getElementById("story-body");
    if (!root) {
        throw new Error("Story: #story-body not found.");
    }
    root.replaceChildren();
    paragraphs.forEach((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        root.appendChild(p);
    });
}

/**
 * @param {ScheduleItem[]} items
 */
function renderSchedule(items) {
    const list = document.getElementById("schedule-list");
    if (!list) {
        throw new Error("Schedule: #schedule-list not found.");
    }
    list.replaceChildren();
    items.forEach((item) => {
        const li = document.createElement("li");
        const timeSpan = document.createElement("span");
        timeSpan.className = "schedule-list__time";
        timeSpan.textContent = item.timeLabel;

        const body = document.createElement("div");
        const title = document.createElement("p");
        title.className = "schedule-list__title";
        title.textContent = item.title;
        const desc = document.createElement("p");
        desc.className = "schedule-list__desc";
        desc.textContent = item.description;
        body.appendChild(title);
        body.appendChild(desc);

        li.appendChild(timeSpan);
        li.appendChild(body);
        list.appendChild(li);
    });
}

/**
 * @param {Venue[]} venues
 */
function renderVenues(venues) {
    const root = document.getElementById("venues-root");
    if (!root) {
        throw new Error("Venues: #venues-root not found.");
    }
    root.replaceChildren();
    venues.forEach((venue) => {
        const card = document.createElement("article");
        card.className = "venue-card";

        const title = document.createElement("h3");
        title.className = "venue-card__title";
        title.textContent = venue.name;

        const mapWrap = document.createElement("div");
        mapWrap.className = "venue-card__map";

        const iframe = document.createElement("iframe");
        iframe.setAttribute("title", `${venue.name} քարտեզ`);
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
        iframe.src = venue.mapEmbedUrl;

        mapWrap.appendChild(iframe);
        card.appendChild(title);
        card.appendChild(mapWrap);
        root.appendChild(card);
    });
}

/**
 * @param {{ telHref: string, label: string }} rsvpPhone
 */
function wireRsvp(rsvpPhone) {
    const link = document.getElementById("rsvp-phone-link");
    if (!link || !(link instanceof HTMLAnchorElement)) {
        throw new Error("RSVP: #rsvp-phone-link not found.");
    }
    link.href = rsvpPhone.telHref;
    link.textContent = rsvpPhone.label;
}

/**
 * @param {string} audioSrc
 */
function wireMusic(audioSrc) {
    const block = document.getElementById("music-block");
    const toggle = document.getElementById("music-toggle");
    const audio = document.getElementById("bg-audio");
    const errEl = document.getElementById("music-error");

    if (!block || !toggle || !audio || !errEl) {
        throw new Error("Music: required DOM nodes are missing.");
    }
    if (!(toggle instanceof HTMLButtonElement) || !(audio instanceof HTMLAudioElement)) {
        throw new Error("Music: invalid element types.");
    }

    block.hidden = false;
    audio.src = audioSrc;

    const showError = (message) => {
        errEl.hidden = false;
        errEl.textContent = message;
    };

    toggle.addEventListener("click", async () => {
        errEl.hidden = true;
        try {
            if (audio.paused) {
                await audio.play();
                toggle.textContent = "Կանգնեցնել";
                toggle.setAttribute("aria-pressed", "true");
            } else {
                audio.pause();
                toggle.textContent = "Միացնել";
                toggle.setAttribute("aria-pressed", "false");
            }
        } catch {
            showError("Ձեր դիտարկիչը չի աջակցում աուդիո նվագարկմանը կամ ֆայլը բացակայում է։");
            toggle.setAttribute("aria-pressed", "false");
        }
    });
}

/**
 * @param {typeof INVITATION_CONFIG} config
 */
function applyStaticHero(config) {
    const heroImage = document.getElementById("hero-image");
    const n1 = document.getElementById("couple-name-1");
    const n2 = document.getElementById("couple-name-2");
    const invitation = document.getElementById("hero-invitation");
    const dateLine = document.getElementById("hero-date-line");
    if (!heroImage || !(heroImage instanceof HTMLImageElement)) {
        throw new Error("Hero: #hero-image not found.");
    }
    if (!n1 || !n2 || !invitation || !dateLine) {
        throw new Error("Hero: required DOM nodes are missing.");
    }
    heroImage.src = config.heroImageSrc;
    heroImage.alt = `${config.coupleNames.partner1} և ${config.coupleNames.partner2} — հարսանյաց լուսանկար`;
    n1.textContent = config.coupleNames.partner1;
    n2.textContent = config.coupleNames.partner2;
    invitation.textContent = config.heroInvitationText;
    dateLine.textContent = config.heroDateDisplayHy;
}

function initInvitationPage() {
    validateInvitationConfig(INVITATION_CONFIG);

    const targetDate = buildEventTargetDate(INVITATION_CONFIG.eventDate);
    if (Number.isNaN(targetDate.getTime())) {
        throw new Error("INVITATION_CONFIG: eventDate produces an invalid Date.");
    }

    applyStaticHero(INVITATION_CONFIG);
    renderStory(INVITATION_CONFIG.storyParagraphs);
    renderSchedule(INVITATION_CONFIG.scheduleItems);
    renderVenues(INVITATION_CONFIG.venues);
    wireRsvp(INVITATION_CONFIG.rsvpPhone);
    startCountdown(targetDate);

    if (typeof INVITATION_CONFIG.audioSrc === "string") {
        wireMusic(INVITATION_CONFIG.audioSrc);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        initInvitationPage();
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Անհայտ սխալ է տեղի ունեցել։";
        document.body.innerHTML = "";
        const box = document.createElement("div");
        box.setAttribute("role", "alert");
        box.style.cssText =
            "font-family:system-ui,sans-serif;padding:2rem;max-width:40rem;margin:2rem auto;line-height:1.5;";
        const title = document.createElement("h1");
        title.textContent = "Կարգավորման սխալ";
        const pre = document.createElement("pre");
        pre.style.whiteSpace = "pre-wrap";
        pre.textContent = message;
        box.appendChild(title);
        box.appendChild(pre);
        document.body.appendChild(box);
    }
});
