const firstSelect = document.querySelector(".first-select");
const secondSelect = document.querySelector(".second-select");
const thirdSelect = document.querySelector(".third-select");
const audio = document.querySelector("#audio");

// console.log(secondSelect);

async function getDataqare2() {
  const prom = await fetch(
    "https://www.mp3quran.net/api/v3/reciters?language=ar"
  );
  const res = await prom.json();
  const data = res.reciters;
  data.map((rec) => {
    let firstSelectUi = `
<option value =${rec.id}  class="text-center">${rec.name}</option>`;
    firstSelect.innerHTML += firstSelectUi;
  });
}
getDataqare2();

firstSelect.addEventListener("change", async () => {
console.log(firstSelect.value);
if(firstSelect.value != 'choose'){
  thirdSelect.innerHTML = `<option  class="text-center ">اختيارالسورة</option>`;
  const prom = await fetch(
    `https://mp3quran.net/api/v3/reciters?language=ar&reciter=${firstSelect.value}`
  );
  const res = await prom.json();
  const data = res.reciters;
  data.map((rec) => {
    // console.log(rec.moshaf);
    let moshafData = rec.moshaf;
    moshafData.map((moshaf) => {
      //   console.log(moshaf.name);
      let secondSelectUi = `
    <option  value= ${moshaf.id} class="text-center">${moshaf.name}</option>`;
      secondSelect.innerHTML += secondSelectUi;
    });
  }); 
}else{
  secondSelect.innerHTML = `<option  class="text-center ">اختيار المصحف</option>`;
  thirdSelect.innerHTML = `<option  class="text-center ">اختيارالسورة</option>`;
}
 
});

function resetDataMoshaf() {
  secondSelect.innerHTML = `<option  class="text-center ">اختيار المصحف</option>`;
}

secondSelect.addEventListener("change", async () => {
  if(secondSelect.value != 'اختيار المصحف'){
    const promReciter = await fetch(
      `https://mp3quran.net/api/v3/reciters?language=ar&reciter=${firstSelect.value}`
    );
    const promSwar = await fetch("https://mp3quran.net/api/v3/suwar");
    const resSwar = await promSwar.json();
    const dataSwar = resSwar.suwar;
    const res = await promReciter.json();
    const data = res.reciters;
  
    data.map((rec) => {
      let moshafData = rec.moshaf;
      // console.log(rec.moshaf);
      let result = moshafData.filter((moshaf) => {
        return moshaf.id == `${secondSelect.value}`;
      });
      // console.log(result);
      let surahList = [];
      result.map((surah) => {
        surahList = surah.surah_list.split(",");
      });
      dataSwar.map((swar) => {
        surahList.map((surah) => {
          if (surah == swar.id) {
            //   console.log(swar.name);
            let thirdSelectUi = `
      <option class="text-center third-select" value =${surah}>${swar.name}</option>`;
            thirdSelect.innerHTML += thirdSelectUi;
          }
        });
      });
    });
  }else{
    thirdSelect.innerHTML = `<option  class="text-center ">اختيارالسورة</option>`
  }
 
});

function resetDataSurah() {
  thirdSelect.innerHTML = `<option  class="text-center ">اختيارالسورة</option>`;
}

thirdSelect.addEventListener("change", async () => {
  if(thirdSelect.value !='اختيارالسورة'){
    const promReciter = await fetch(
      `https://mp3quran.net/api/v3/reciters?language=ar&reciter=${firstSelect.value}`
    );
    const res = await promReciter.json();
    const data = res.reciters;
    // console.log(data);
    data.map((data) => {
      data.moshaf.map((ele) => {
        console.log(ele.server);
        let surahId = thirdSelect.value;
  
        surahId = surahId.padStart(3, "0");
        console.log(surahId);
        audio.innerHTML = `<source src = ${ele.server}/${surahId}.mp3 type="audio/mpeg" />`;
        audio.load();
      });
    });
  }
  
});
