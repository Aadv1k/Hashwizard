let formHash = document.getElementById("formHash");
let formHashAlgorithm = document.getElementById("formHashAlgorithm");
let formHashSubmit = document.getElementById("formHashSubmit");
let formHashOutput = document.getElementById("formHashOutput");

formHash.addEventListener("submit", async (e) => {
  e.preventDefault();
  let {formHashAlgorithm, textToHash} = Object.fromEntries(new FormData(e.target));
  let res = await fetch(`/api/hash/${formHashAlgorithm}?text=${encodeURI(textToHash)}`)
  let data = await res.json()

  if (!res.ok) {
    console.error("error");
    return;
  }
  
  formHashOutput.insertAdjacentHTML("afterbegin", `
    <li>
      <span class="input">
      ${data.text}
      </span>

      <span class="output">
      ${data.hash}
      </span>
    </li>
  `);
})

