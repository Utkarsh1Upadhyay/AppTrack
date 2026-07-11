function saveToStorage() {
    const entries = [];
    document.querySelectorAll("#pending-body tr").forEach(row => {
        entries.push({
            name: row.querySelector("td input").value,
            link: row.querySelector(".link input").value,
            deadline: row.querySelector(".deadline input").value,
            table: "pending"
        });
    });
    document.querySelectorAll("#passed-body tr").forEach(row => {
        const cells = row.querySelectorAll("td");
        entries.push({
            name: cells[0].innerText,
            link: cells[1].innerText,
            deadline: cells[2].innerText,
            status: cells[3].innerText,
            note: cells[4].querySelector("input").value,
            table: "passed"
        });
    });

    localStorage.setItem("internships", JSON.stringify(entries));
}

function loadFromStorage() {
    const saved = localStorage.getItem('internships');
    if (!saved) return;
    const entries = JSON.parse(saved);
    entries.forEach(entry => {
        if (entry.table === "pending") {
            addToPending(entry.name, entry.link, entry.deadline);
        }
        else {
            addToPassed(entry.name, entry.link, entry.deadline, entry.status, entry.note);
        }
    });
}

const timers = new Map();

function timer(event) {
    const fin = new Date(event.target.value);
    const rowLoc = (event.currentTarget.parentElement);
    const tdLoc = rowLoc.querySelector(".remaining");
    clearInterval(timers.get(rowLoc));
    const id = setInterval(() => {
        const timeLeft = fin.getTime() - Date.now();
        //Date.now() and new Date().getTime() gives the same answer
        if (timeLeft <= 0) {
            subtract(rowLoc, "Expired");
            return;
            // return only ends this one execution of the callback and does not stop the interval forever
            // Return exits the current function call.
        }
        else {

            const remD = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const remH = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const remM = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const remS = Math.floor((timeLeft % (1000 * 60)) / 1000);

            const left = ` ${remD} Days, ${remH} Hours, ${remM} Minutes, ${remS} Seconds Left`;
            tdLoc.innerText = left;
        }
    }, 1000);
    timers.set(rowLoc, id);
}

var countrem = 1;
var countpas = 1;

document.querySelector("tfoot button").addEventListener("click", add);

function add() {
    addToPending("", "", "");
    saveToStorage();
}

function subtract(row, status) {

    //another way which doesnt involve parent
    // const row = event.target.closest("tr");
    // const td = event.target.closest("td");
    // const form = event.target.closest("form");
    // const card = event.target.closest(".card");
    const tri = row;
    clearInterval(timers.get(tri));
    timers.delete(tri);
    tri.remove();

    // tri.remove();
    // clearInterval(timers.get(tri));
    // timers.delete(tri);
    //this will work as well
    // because tri is still a valid object reference after remove().

    const name = tri.querySelector("td input").value;
    const link = tri.querySelector(".link input").value;
    const deadline = tri.querySelector(".deadline input").value;



    const thi = document.querySelectorAll("th");
    for (var i = 1; i <= countrem - 2; i++) {
        var item = thi[5 + i];
        item.innerText = i;
    }
    countrem--;

    addToPassed(name, link,deadline, status, "");
    saveToStorage();
}


function addToPending(name, link, deadline) {
    if (countrem <= 8) {
        const r = document.createElement("tr");
        r.setAttribute("id", "x");

        document.querySelector("#pending-body").appendChild(r);

        const o = document.createElement("th");
        o.innerText = countrem;
        document.querySelector("#x").appendChild(o);

        const a = document.createElement("td");
        a.innerHTML = '<input type="text" />';
        a.querySelector("input").value = name;
        //a more defensive would be:a.querySelector("input").value = name || "";
        a.querySelector("input").addEventListener("blur", saveToStorage);
        document.querySelector("#x").appendChild(a);

        const b = document.createElement("td");
        b.innerHTML = '<input type="text" />';
        b.setAttribute("class", "link");
        b.querySelector("input").value = link;
        b.querySelector("input").addEventListener("blur", saveToStorage);
        document.querySelector("#x").appendChild(b);

        // instead of giving r an id and then removing it each time
        //and using query selector for each td,you can directly use r
        // r.appendChild(o);
        // r.appendChild(a);
        // r.appendChild(b);

        const c = document.createElement("td");
        c.setAttribute("class", "deadline");
        c.innerHTML = '<input type="datetime-local" step="1"/>';
        c.querySelector("input").value = deadline;
        c.querySelector("input").addEventListener("blur", saveToStorage);
        document.querySelector("#x").appendChild(c);
        c.addEventListener("input", timer);

        const d = document.createElement("td");
        d.setAttribute("class", "remaining");
        document.querySelector("#x").appendChild(d);

        const e = document.createElement("td");
        e.innerHTML = '<input type="checkbox">';
        document.querySelector("#x").appendChild(e);
        e.addEventListener("click", (event) => subtract(event.currentTarget.parentElement, "Applied"));

        r.removeAttribute("id");
        countrem++;

        if (deadline) {
            const fakeEvent = {
                target: { value: deadline },
                currentTarget: { parentElement: r }
            }
            timer(fakeEvent);
        }
    }
    //Other way and better too to embedd input element without parsing
    // const r = document.createElement("tr");
    // document.querySelector(".row").appendChild(r);

    // const td = document.createElement("td");

    // const input = document.createElement("input");
    // input.type = "text";
    // input.maxLength = 20;

    // td.appendChild(input);
    // r.appendChild(td);
}

function addToPassed(name, link, deadline, status, note) {

    const r1 = document.createElement("tr");
    r1.setAttribute("id", "x");

    document.querySelector("#passed-body").appendChild(r1);

    const o1 = document.createElement("th");
    o1.innerText = countpas;
    document.querySelector("#x").appendChild(o1);

    const a1 = document.createElement("td");
    a1.innerText = name;
    document.querySelector("#x").appendChild(a1);

    const b1 = document.createElement("td");
    b1.innerText = link;
    document.querySelector("#x").appendChild(b1);

    const c1 = document.createElement("td");
    c1.innerText = deadline;
    document.querySelector("#x").appendChild(c1);

    const d1 = document.createElement("td");
    d1.innerText = status;
    document.querySelector("#x").appendChild(d1);

    const e1 = document.createElement("td");
    e1.innerHTML = '<input type="text" />';
    e1.querySelector("input").value = note;
    document.querySelector("#x").appendChild(e1);

    r1.removeAttribute("id");
    countpas++;
}

function clearAll()
{
    localStorage.clear();
    document.querySelector("#pending-body").innerHTML="";
    document.querySelector("#passed-body").innerHTML="";
    countrem=1;
    countpas=1;
    timers.forEach(id=>clearInterval(id));
    timers.clear();
}
loadFromStorage();
/*
IMPORTANT: JavaScript variables DO NOT store objects; they store REFERENCES
(addresses) to objects in memory.

Example:
const row = document.createElement("tr");
-> A <tr> object is created in memory, and 'row' stores a reference to it.

appendChild(row)
-> Does NOT create another <tr>. The DOM simply stores another reference to
the SAME object.

timers.set(row, id)
-> The Map also stores a reference to the SAME <tr> object as its key.

So the same object can simultaneously be referenced by:
1. A JavaScript variable (row, tri, etc.)
2. The DOM tree
3. A Map
4. Event listeners/closures

Calling row.remove() ONLY removes the DOM's reference. The object still exists
in memory as long as at least one other reference exists (variable, Map, etc.)

tri.remove();        // DOM reference gone
timers.delete(tri);  // Map reference gone
tri = null;          // Variable reference gone

An object is eligible for garbage collection ONLY when ALL references to it
are gone. Therefore, always think in terms of "Who currently has a reference
to this object?" rather than "Is it still in the DOM?".
*/
