let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;
const slideCounter = document.getElementById("slideCounter");
const progressFill = document.getElementById("progressFill");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function showSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    slides[currentSlide].classList.remove("active");
    currentSlide = index;
    slides[currentSlide].classList.add("active");
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    progressFill.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
    if (typeof Prism !== "undefined") Prism.highlightAll();
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

document.addEventListener("keydown", (event) => {
    const tag = event.target?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (event.key === "ArrowLeft") changeSlide(1);
    if (event.key === "ArrowRight") changeSlide(-1);
    if (event.key === "Home") showSlide(0);
    if (event.key === "End") showSlide(totalSlides - 1);
});

function printToOutput(outputId, callback) {
    const output = document.getElementById(outputId);
    const lines = [];
    const originalLog = console.log;
    output.textContent = "";
    console.clear();
    console.log = (...args) => {
        const line = args.map(formatValue).join(" ");
        lines.push(line);
        originalLog(...args);
    };
    try { callback(); }
    catch (error) { lines.push(`שגיאה: ${error.message}`); originalLog(error); }
    finally { console.log = originalLog; output.textContent = lines.join("\n"); }
}

function formatValue(value) {
    if (Array.isArray(value)) return `[${value.map(formatValue).join(", ")}]`;
    if (typeof value === "object" && value !== null) return JSON.stringify(value, null, 2);
    return String(value);
}

const demos = {
    scopeGlobal() {
        const appName = "Course App";
        let counter = 0;
        function increment() {
            counter++;
            console.log(`${appName} — counter:`, counter);
        }
        increment();
        increment();
        console.log("appName גלובלי:", appName);
    },

    scopeBlock() {
        const user = "נועה";
        if (true) {
            const greeting = `שלום ${user}`;
            console.log(greeting);
        }
        console.log("greeting קיים רק בתוך הבלוק של if");
    },

    scopeChain() {
        const city = "תל אביב";
        function outer() {
            const city = "חיפה";
            function inner() {
                const city = "ירושלים";
                console.log("inner:", city);
            }
            inner();
            console.log("outer:", city);
        }
        outer();
        console.log("גלובלי:", city);
    },

    scopeInLoop() {
        const results = [];
        for (let i = 0; i < 3; i++) {
            const label = `פריט ${i}`;
            results.push(label);
        }
        console.log("תוצאות:", results);
        console.log("i לא זמין מחוץ ל-for כשמשתמשים ב-let");
    },

    validationBasic() {
        const name = "   ";
        const age = "17";
        console.log("שם ריק?", name.trim() === "");
        console.log("גיל מספר?", typeof Number(age) === "number" && !Number.isNaN(Number(age)));
        console.log("גיל תקין?", Number(age) >= 18);
    },

    validationEmail() {
        function isValidEmail(email) {
            return email.includes("@") && email.includes(".") && email.length >= 5;
        }
        console.log("test@mail.com:", isValidEmail("test@mail.com"));
        console.log("bad-email:", isValidEmail("bad-email"));
    },

    validateUser() {
        function validateUser(user) {
            const errors = [];
            if (!user.name || user.name.trim() === "") errors.push("שם חסר");
            if (typeof user.age !== "number" || user.age < 18) errors.push("גיל לא תקין");
            if (!user.email || !user.email.includes("@")) errors.push("אימייל לא תקין");
            return { valid: errors.length === 0, errors };
        }
        const good = validateUser({ name: "דני", age: 22, email: "d@x.com" });
        const bad = validateUser({ name: "", age: 15, email: "oops" });
        console.log("משתמש תקין:", good);
        console.log("משתמש לא תקין:", bad);
    },

    loopsBasic() {
        console.log("--- for ---");
        for (let i = 1; i <= 3; i++) console.log("for:", i);
        console.log("--- while ---");
        let n = 1;
        while (n <= 3) { console.log("while:", n); n++; }
        console.log("--- do...while ---");
        let m = 0;
        do { m++; console.log("do...while:", m); } while (m < 3);
    },

    breakContinue() {
        for (let i = 1; i <= 8; i++) {
            if (i % 2 !== 0) continue;
            if (i > 6) break;
            console.log("זוגי:", i);
        }
    },

    arrayPushPop() {
        const fruits = ["תפוח", "בננה"];
        console.log("התחלה:", fruits);
        fruits.push("תות");
        console.log("אחרי push:", fruits);
        const last = fruits.pop();
        console.log("pop החזיר:", last);
        console.log("אחרי pop:", fruits);
    },

    arrayShiftUnshift() {
        const queue = ["שני", "שלישי"];
        console.log("התחלה:", queue);
        queue.unshift("ראשון");
        console.log("אחרי unshift:", queue);
        const first = queue.shift();
        console.log("shift החזיר:", first);
        console.log("אחרי shift:", queue);
    },

    sliceSplice() {
        const nums = [10, 20, 30, 40, 50];
        console.log("מקור התחלתי:", nums);
        const piece = nums.slice(1, 4);
        console.log("slice(1, 4) →", piece, "(אינדקס 1 עד לפני 4)");
        console.log("מקור אחרי slice — לא השתנה:", nums);
        const removed = nums.splice(2, 2, 99, 100);
        console.log("splice(2, 2, 99, 100) — נמחק:", removed);
        console.log("מקור אחרי splice — השתנה:", nums);
    },

    arrayAdvanced() {
        const tags = ["js", "html", "css", "js"];
        console.log("מערך:", tags);
        console.log("indexOf('js'):", tags.indexOf("js"), "← אינדקס ראשון");
        console.log("indexOf('react'):", tags.indexOf("react"), "← -1 = לא נמצא");
        console.log("includes('css'):", tags.includes("css"));
        console.log("includes('react'):", tags.includes("react"));
        console.log("join(' | '):", tags.join(" | "));
        const nums = [3, 1, 4];
        const reversed = [...nums].reverse();
        console.log("מקור:", nums, "← לא השתנה");
        console.log("[...nums].reverse():", reversed);
    },

    objectMethods() {
        const user = { name: "מאיה", role: "student", active: true };
        console.log("keys (שמות שדות):", Object.keys(user));
        console.log("values (ערכים בלבד):", Object.values(user));
        console.log("entries (זוגות):", Object.entries(user));
        console.log("--- מעבר עם entries + for...of ---");
        for (const [key, value] of Object.entries(user)) {
            console.log(`${key} => ${value}`);
        }
    },

    iterationAll() {
        const skills = ["HTML", "CSS", "JS"];
        console.log("for קלאסי:");
        for (let i = 0; i < skills.length; i++) console.log(i, skills[i]);
        console.log("forEach:");
        skills.forEach((s, i) => console.log(i, s));
        console.log("for...of:");
        for (const skill of skills) console.log(skill);
        const config = { theme: "dark", lang: "he" };
        console.log("for...in:");
        for (const key in config) console.log(key, config[key]);
        console.log("Object.entries + for...of:");
        for (const [k, v] of Object.entries(config)) console.log(k, "=", v);
    },

    nestedArrayObjects() {
        const students = [
            { name: "נועה", grade: 92 },
            { name: "דניאל", grade: 78 },
            { name: "מאיה", grade: 85 }
        ];
        console.log("מי עבר מעל 80?");
        for (const student of students) {
            if (student.grade >= 80) console.log(student.name, student.grade);
        }
    },

    nestedObjectArrays() {
        const classroom = {
            className: "JS 2026",
            students: ["אלכס", "נועה", "דניאל"],
            grades: [90, 82, 76]
        };
        console.log("כיתה:", classroom.className);
        console.log("תלמידים:");
        classroom.students.forEach((name, i) => {
            console.log(`${name}: ${classroom.grades[i]}`);
        });
    },

    spreadDemo() {
        const a = [1, 2, 3];
        const b = [...a, 4, 5];
        console.log("מערך מועתק + חדש:", b);
        const user = { name: "דני", age: 20 };
        const profile = { ...user, city: "תל אביב", age: 21 };
        console.log("אובייקט מורחב:", profile);
        const merged = { ...user, ...{ role: "admin", active: true } };
        console.log("מיזוג אובייקטים:", merged);
    },

    practiceLive() {
        function validateAndFilter(users) {
            const valid = [];
            for (const user of users) {
                if (!user.name?.trim()) continue;
                if (typeof user.age !== "number" || user.age < 18) continue;
                valid.push({ ...user, status: "מאושר" });
            }
            return valid;
        }
        const users = [
            { name: "נועה", age: 20 },
            { name: "", age: 25 },
            { name: "דני", age: 16 },
            { name: "מאיה", age: 22 }
        ];
        const approved = validateAndFilter(users);
        console.log("משתמשים מאושרים:", approved);
        console.log("סה\"כ:", approved.length);
    }
};

function runDemo(demoName) {
    const demo = demos[demoName];
    if (demo) printToOutput(`output-${demoName}`, demo);
}

showSlide(0);

console.log("%c🎓 JavaScript — שיעור 7", "font-size: 20px; font-weight: bold; color: #4f46e5;");
console.log("%cScope · Validation · Loops · Arrays · Objects · Spread", "font-size: 14px; color: #0d9488;");
