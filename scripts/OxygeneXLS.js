// Appliquer des transformations et des nettoyages sur les données ici
function cleanOxygeneData(data) {
    console.log(data);
  // Filtre dans un premier temps la data par qualité
  const newDataByQuality = data.filter((item) => parseInt(item.Quality) === 1);
  console.log(newDataByQuality)

  //   Puis par valeur (ici l'oxygène)
  const finalData = [];
  for (let i = 0; i < newDataByQuality.length - 1; i++) {
    if (Math.abs(data[i].OD - data[i + 1].OD) < 0.2) {
      finalData.push(data[i]);
    }
  }
  console.log(finalData)
  return finalData;
}

// Récupérer le formulaire d'upload
const uploadForm = document.getElementById("upload-form");
// Récupérer le bouton de téléchargement..
const downloadButton = document.getElementById("download-button");

// Gérer la soumission du formulaire
uploadForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêcher la soumission du formulaire

  // Récupérer le fichier téléchargé
  const file = document.querySelector(".upload-file").files[0];

  // Vérifier que le fichier a été sélectionné
  if (!file) {
    alert("Veuillez sélectionner un fichier");
    return;
  }

  // Vérifier que le fichier a une extension XLS
  if (file.name.substr(-5) !== ".xlsx") {
    alert("Veuillez sélectionner un fichier XLSX");
    return;
  }

  // Lire le fichier en tant que binaire
  const reader = new FileReader();
  reader.readAsBinaryString(file);

  // Appliquer la fonction de nettoyage lorsque le fichier est lu
  reader.onload = () => {
    const workbook = XLSX.read(reader.result, { type: "binary" }); // Lire le fichier XLS en utilisant l'API JS-XLSX

    const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Obtenir la première feuille de calcul

    let data = XLSX.utils.sheet_to_json(sheet); // Convertir la feuille de calcul en un tableau d'objets JavaScript

    const cleanedData = cleanOxygeneData(data); // Appliquer la fonction de nettoyage
    console.log(cleanedData);

    const cleanedDataJSON = JSON.stringify(cleanedData); // Convertir les données nettoyées en JSON

    //   RECONVERTIR ICI LE FICHIER JSON EN XLSX
    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.json_to_sheet(cleanedData); // Convertir les données nettoyées en une feuille de calcul
    
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Oxygène nettoyé"); // Ajouter la feuille de calcul à l'objet Workbook
    
    const cleanedDataXlsx = XLSX.writeFileXLSX(newWorkbook, "cleaned_oxygene.xlsx", {compression: true}); // Convertir l'objet Workbook en fichier binaire
  };
});


