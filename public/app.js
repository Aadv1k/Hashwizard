let formHash = document.getElementById("formHash");
let formHashAlgorithm = document.getElementById("formHashAlgorithm");
let formHashSubmit = document.getElementById("formHashSubmit");
let formHashOutput = document.getElementById("formHashOutput");

let formCrack = document.getElementById("formCrack");
let formCrackAlgorithm = document.getElementById("formCrackAlgorithm");
let formCrackSubmit = document.getElementById("formCrackSubmit");
let formCrackOutput = document.getElementById("formCrackOutput");

function copyClick(e) {
  navigator.clipboard.writeText(e.getAttribute('data-hash'))
}

function pushHashItemToHTMLList(data, formHashAlgorithm) {
  formHashOutput.insertAdjacentHTML("afterbegin", `
    <li>
      <div class="content">
        <span class="input">
        Text: ${data.text}
        </span>

        <span class="output">
        ${formHashAlgorithm.toUpperCase()}: <code>${data.hash}</code>
        </span>
      </div>

      <button class="btn btn--primary" id="copyBtn" data-hash=${data.hash} onclick="copyClick(this)">Copy</button>
    </li>
  `);
}

formHash.addEventListener("submit", async (e) => {
  e.preventDefault();

  formHashSubmit.classList.add("btn--disabled");
  formHashSubmit.classList.add("btn--loader-show");

  let {formHashAlgorithm, textToHash} = Object.fromEntries(new FormData(e.target));
  textToHash = textToHash.trim();

  let res = await fetch(`/api/hash/${formHashAlgorithm}?text=${encodeURI(textToHash)}`)
  let data = await res.json()

  if (!res.ok) {
    console.error("error");
    return;
  }

  formHashSubmit.classList.remove("btn--disabled");
  formHashSubmit.classList.remove("btn--loader-show");

  pushHashItemToHTMLList(data, formHashAlgorithm);
})


function pushCrackItemToHTMLList(data) {
  formCrackOutput.insertAdjacentHTML("afterbegin", `
    <li>
      <div class="content">
        <span class="input">
        Hash: ${data.hash}
        </span>

        <span class="output">
        Text: <code>${data.text ?? "unable to crack :("}</code>
        </span>
      </div>

      <button class="btn btn--primary" id="copyBtn" data-hash=${data.hash} onclick="copyClick(this)">Copy</button>
    </li>
  `);
}

formCrack.addEventListener("submit", async (e) => {
  e.preventDefault();

  formCrackSubmit.classList.add("btn--disabled");
  formCrackSubmit.classList.add("btn--loader-show");

  let {formCrackAlgorithm, textToCrack} = Object.fromEntries(new FormData(e.target));
  textToCrack = textToCrack.trim();
  let res = await fetch(`/api/crack/${formCrackAlgorithm}?hash=${encodeURI(textToCrack)}`)
  let data = await res.json()

  if (!res.ok) {
    console.error("error");
    return;
  }

  pushCrackItemToHTMLList(data);
  formCrackSubmit.classList.remove("btn--disabled");
  formCrackSubmit.classList.remove("btn--loader-show");
})


