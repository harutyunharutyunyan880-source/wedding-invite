/**
 * @typedef {{ partner1: string, partner2: string }} CoupleNames
 * @typedef {{ hour: number, minute: number }} EventClock
 * @typedef {{ year: number, month: number, day: number, clock: EventClock }} EventDateParts
 * @typedef {{ timeLabel: string, title: string, description: string, yandexMapUrl: string, timeIconSrc?: string | null }} ScheduleItem

 */

/**
 * Central configuration — edit values here (see README for audio).
 * @type {{
 *   coupleNames: CoupleNames,
 *   heroImageSrc: string,
 *   heroInvitationText: string,
 *   heroCalendarImageSrc: string,
 *   eventDate: EventDateParts,
 *   scheduleItems: ScheduleItem[],
 *   rsvpGoogleSheetUrl: string,
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
        "Սիրով հրավիրումենք Ձեզ մեր հարսանիքին, և ուրախ կլինենք, եթե այս երջանիկ օրը անցկացնեք մեզ հետ՝ նվիրելով Ձեր ներկայությունը։",
    heroCalendarImageSrc: "assets/images/օրացույց.jpg",
    eventDate: {
        year: 2026,
        month: 6,
        day: 5,
        clock: { hour: 15, minute: 0 }
    },
    scheduleItems: [
        {
            timeLabel: "14:00",
            title: "Պսակադրություն",
            description: "Լիաննա Գարդեն Հոլի շրջակա այգի։",
            yandexMapUrl:
                "https://yandex.com/maps/org/75872747374/?ll=44.391408%2C40.164666&z=17",
            timeIconSrc: "assets/images/schedule-rings.png"
        },
        {
            timeLabel: "18:00",
            title: "Հարսանյաց Հանդես",
            description: "Լիաննա Գարդեն Հոլ ռեստորան։",
            yandexMapUrl:
                "https://yandex.com/maps/org/75872747374/?ll=44.391408%2C40.164666&z=17",
            timeIconSrc: "assets/images/schedule-toast.png"
        }
    ],
    rsvpGoogleSheetUrl: "https://script.google.com/macros/s/AKfycbzsZx-slZw1oPhre0Jg6iv73c5ylk-3tR0BED4lPBVD5-9DTwvJMUPWTVbIRN1D--0X/exec",
    audioSrc: "assets/audio/wedding.mp3"
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
        assertNonEmptyString(item.yandexMapUrl, `scheduleItems[${index}].yandexMapUrl`);
        if (!item.yandexMapUrl.startsWith("https://")) {
            throw new Error(
                `INVITATION_CONFIG: scheduleItems[${index}].yandexMapUrl must be an https URL.`
            );
        }
        if (item.timeIconSrc !== undefined && item.timeIconSrc !== null) {
            assertNonEmptyString(
                item.timeIconSrc,
                `scheduleItems[${index}].timeIconSrc`
            );
        }
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
    assertNonEmptyString(config.heroCalendarImageSrc, "heroCalendarImageSrc");
    validateScheduleItems(config.scheduleItems);
    assertNonEmptyString(config.rsvpGoogleSheetUrl, "rsvpGoogleSheetUrl");
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
        const timeCell = document.createElement("div");
        timeCell.className = "schedule-list__time-cell";

        const timeSpan = document.createElement("span");
        timeSpan.className = "schedule-list__time";
        timeSpan.textContent = item.timeLabel;
        timeCell.appendChild(timeSpan);

        if (
            typeof item.timeIconSrc === "string" &&
            item.timeIconSrc.trim().length > 0
        ) {
            const icon = document.createElement("img");
            icon.className = "schedule-list__time-icon";
            icon.src = item.timeIconSrc;
            icon.alt = "";
            icon.setAttribute("aria-hidden", "true");
            icon.width = 96;
            icon.height = 96;
            icon.setAttribute("loading", "lazy");
            timeCell.appendChild(icon);
        }

        const body = document.createElement("div");
        body.className = "schedule-list__body";
        const title = document.createElement("p");
        title.className = "schedule-list__title";
        title.textContent = item.title;
        const desc = document.createElement("p");
        desc.className = "schedule-list__desc";
        desc.textContent = item.description;
        body.appendChild(title);
        body.appendChild(desc);

        const mapLink = document.createElement("a");
        mapLink.className = "btn btn--outline";
        mapLink.href = item.yandexMapUrl;
        mapLink.target = "_blank";
        mapLink.rel = "noopener noreferrer";
        mapLink.setAttribute("aria-label", `Քարտեզ — ${item.title}`);
        mapLink.textContent = "Քարտեզ";
        body.appendChild(mapLink);

        li.appendChild(timeCell);
        li.appendChild(body);
        list.appendChild(li);
    });
}

/**
 * @param {string} googleSheetUrl
 */
function wireRsvpForm(googleSheetUrl) {
    const form = document.getElementById("rsvp-form");
    const guestsContainer = document.getElementById("rsvp-guests");
    const addBtn = document.getElementById("rsvp-add-guest");
    const submitBtn = document.getElementById("rsvp-submit");
    const statusEl = document.getElementById("rsvp-status");

    if (!form || !(form instanceof HTMLFormElement)) {
        throw new Error("RSVP: #rsvp-form not found.");
    }
    if (!guestsContainer || !addBtn || !submitBtn || !statusEl) {
        throw new Error("RSVP: required DOM nodes are missing.");
    }

    /** @type {number} */
    let guestCounter = 1;

    /**
     * @param {number} index
     * @returns {HTMLDivElement}
     */
    function createGuestField(index) {
        const field = document.createElement("div");
        field.className = "rsvp-form__field";

        const label = document.createElement("label");
        label.setAttribute("for", "rsvp-guest-" + index);
        label.className = "rsvp-form__label";
        label.textContent = "Անուն ազգանուն";

        const input = document.createElement("input");
        input.type = "text";
        input.id = "rsvp-guest-" + index;
        input.name = "guest";
        input.className = "rsvp-form__input";
        input.required = true;
        input.autocomplete = "name";

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "rsvp-form__remove-btn";
        removeBtn.textContent = "×";
        removeBtn.setAttribute("aria-label", "Հեռացնել");
        removeBtn.addEventListener("click", () => {
            field.remove();
        });

        field.appendChild(label);
        field.appendChild(input);
        field.appendChild(removeBtn);
        return field;
    }

    addBtn.addEventListener("click", () => {
        const field = createGuestField(guestCounter);
        guestsContainer.appendChild(field);
        const newInput = field.querySelector("input");
        if (newInput instanceof HTMLInputElement) {
            newInput.focus();
        }
        guestCounter++;
    });

    /**
     * @param {string} message
     * @param {"success" | "error"} type
     */
    function showStatus(message, type) {
        statusEl.hidden = false;
        statusEl.textContent = message;
        statusEl.className = "rsvp-form__status rsvp-form__status--" + type;
    }

    function hideStatus() {
        statusEl.hidden = true;
        statusEl.textContent = "";
    }

    /**
     * @param {boolean} disabled
     */
    function setFormDisabled(disabled) {
        submitBtn.disabled = disabled;
        addBtn.disabled = disabled;
        const inputs = guestsContainer.querySelectorAll("input");
        inputs.forEach((input) => {
            if (input instanceof HTMLInputElement) {
                input.disabled = disabled;
            }
        });
        const removeBtns = guestsContainer.querySelectorAll(".rsvp-form__remove-btn");
        removeBtns.forEach((btn) => {
            if (btn instanceof HTMLButtonElement) {
                btn.disabled = disabled;
            }
        });
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideStatus();

        /** @type {HTMLInputElement[]} */
        const inputs = Array.from(guestsContainer.querySelectorAll("input[name=guest]"));

        inputs.forEach((input) => {
            input.classList.remove("rsvp-form__input--error");
        });

        /** @type {string[]} */
        const names = [];
        /** @type {boolean} */
        let hasError = false;

        inputs.forEach((input) => {
            const value = input.value.trim();
            if (value.length === 0) {
                input.classList.add("rsvp-form__input--error");
                hasError = true;
            } else {
                names.push(value);
            }
        });

        if (hasError || names.length === 0) {
            showStatus("Խնդրում ենք լրացնել բոլոր անունները։", "error");
            return;
        }

        setFormDisabled(true);
        submitBtn.textContent = "Ուղարկվում է…";

        try {
            await fetch(googleSheetUrl, {
                method: "POST",
                mode: "no-cors",
                body: new URLSearchParams({
                    guests: JSON.stringify(names),
                    timestamp: new Date().toISOString()
                })
            });

            showStatus("Շնորհակալություն՝ Ձեր ներկայությունը հաստատված է։", "success");
            form.reset();
            guestsContainer.innerHTML = "";
            const firstField = createGuestField(0);
            firstField.querySelector(".rsvp-form__remove-btn")?.remove();
            guestsContainer.appendChild(firstField);
            guestCounter = 1;
        } catch {
            showStatus("Սխալ տեղի ունեցավ։ Խնդրում ենք նորից փորձել։", "error");
        } finally {
            setFormDisabled(false);
            submitBtn.textContent = "Հաստատել";
        }
    });
}

/**
 * @param {string} audioSrc
 */
function wireMusic(audioSrc) {
    const dock = document.getElementById("music-dock");
    const toggle = document.getElementById("music-toggle");
    const audio = document.getElementById("bg-audio");
    const errEl = document.getElementById("music-error");

    if (!dock || !toggle || !audio || !errEl) {
        throw new Error("Music: required DOM nodes are missing.");
    }
    if (!(toggle instanceof HTMLButtonElement) || !(audio instanceof HTMLAudioElement)) {
        throw new Error("Music: invalid element types.");
    }

    dock.hidden = false;
    audio.src = audioSrc;

    const showError = (message) => {
        errEl.hidden = false;
        errEl.textContent = message;
    };

    const syncUiFromAudio = () => {
        const playing = !audio.paused;
        toggle.classList.toggle("music-dock__btn--playing", playing);
        toggle.setAttribute("aria-pressed", playing ? "true" : "false");
        toggle.setAttribute(
            "aria-label",
            playing ? "Անջատել երաժշտությունը" : "Միացնել երաժշտությունը"
        );
    };

    audio.addEventListener("play", syncUiFromAudio);
    audio.addEventListener("pause", syncUiFromAudio);

    const tryAutoplay = async () => {
        if (!audio.paused) {
            return;
        }
        errEl.hidden = true;
        try {
            await audio.play();
        } catch {
            /* Autoplay often blocked until user gesture; no error banner. */
        }
        syncUiFromAudio();
    };

    void tryAutoplay();
    audio.addEventListener(
        "loadeddata",
        () => {
            void tryAutoplay();
        },
        { once: true }
    );

    const unlockPlaybackOnce = () => {
        void tryAutoplay();
    };
    document.addEventListener("pointerdown", unlockPlaybackOnce, { capture: true, once: true });

    toggle.addEventListener("click", async () => {
        errEl.hidden = true;
        try {
            if (audio.paused) {
                await audio.play();
            } else {
                audio.pause();
            }
        } catch {
            showError("Ձեր դիտարկիչը չի աջակցում աուդիո նվագարկմանը կամ ֆայլը բացակայում է։");
            audio.pause();
            syncUiFromAudio();
        }
    });

    syncUiFromAudio();
}

/**
 * @param {typeof INVITATION_CONFIG} config
 */
function applyStaticHero(config) {
    const heroSection = document.getElementById("hero");
    const heroImage = document.getElementById("hero-image");
    const n1 = document.getElementById("couple-name-1");
    const n2 = document.getElementById("couple-name-2");
    const invitation = document.getElementById("hero-invitation");
    const calendarImage = document.getElementById("hero-calendar-image");
    if (!heroSection || !(heroSection instanceof HTMLElement)) {
        throw new Error("Hero: #hero not found.");
    }
    if (!heroImage || !(heroImage instanceof HTMLImageElement)) {
        throw new Error("Hero: #hero-image not found.");
    }
    if (
        !n1 ||
        !n2 ||
        !invitation ||
        !calendarImage ||
        !(calendarImage instanceof HTMLImageElement)
    ) {
        throw new Error("Hero: required DOM nodes are missing.");
    }
    heroSection.style.setProperty("--hero-bg-image", `url("${config.heroImageSrc}")`);
    heroImage.src = config.heroImageSrc;
    heroImage.alt = `${config.coupleNames.partner1} և ${config.coupleNames.partner2} — հարսանյաց լուսանկար`;
    n1.textContent = config.coupleNames.partner1;
    n2.textContent = config.coupleNames.partner2;
    invitation.textContent = config.heroInvitationText;
    calendarImage.src = config.heroCalendarImageSrc;
    calendarImage.alt = "Ապրիլ ամսվա օրացույց՝ նշված է հարսանյաց ամսաթիվը";
}

function initInvitationPage() {
    validateInvitationConfig(INVITATION_CONFIG);

    const targetDate = buildEventTargetDate(INVITATION_CONFIG.eventDate);
    if (Number.isNaN(targetDate.getTime())) {
        throw new Error("INVITATION_CONFIG: eventDate produces an invalid Date.");
    }

    applyStaticHero(INVITATION_CONFIG);
    renderSchedule(INVITATION_CONFIG.scheduleItems);
    document.getElementById("locations")?.remove();
    wireRsvpForm(INVITATION_CONFIG.rsvpGoogleSheetUrl);
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
