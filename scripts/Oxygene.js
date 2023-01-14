// Appliquer des transformations et des nettoyages sur les données ici
async function cleanOxygeneData(data) {
  console.log(data);
  // Filtre dans un premier temps la data par qualité
  let dataByQuality = data.filter((item) => parseInt(item.Quality) === 1);

  const newData = [...dataByQuality];

  //   Puis par valeur (ici l'oxygène)
  for (let i = 0; i < newData.length - 1; i++) {
    const tolerance = 0.125;
    const currentOxygene = newData[i].OD;
    let nextOxygene = newData[i + 1].OD;
    const difference = Math.abs(currentOxygene - nextOxygene);
    if (difference > tolerance) {
      // Remplacez la valeur de l'oxygène suivant par "NV"
      nextOxygene = "NV";
    }

    let j = 1;
    while (nextOxygene === "NV") {
      j++;
      nextOxygene = newData[i + j].OD;
    }

      // Bouclez à travers les valeurs suivantes pour vérifier la limite de tolérance
      for (let k = 1; k < j; k++) {
        const difference = Math.abs(currentOxygene - newData[i + k].OD)
        if (difference > tolerance) {
          newData[i + k].OD = "NV";
        }
      }
  }
  console.log(newData);
  return newData;
}

// Récupérer le formulaire d'upload
const uploadForm = document.getElementById("upload-form");
// Récupérer le bouton de téléchargement..
const downloadButton = document.getElementById("download-button");

// Gérer la soumission du formulaire
uploadForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêzcher la soumission du formulaire

  // Récupérer le fichier téléchargé
  const file = document.querySelector(".upload-file").files[0];

  // Vérifier que le fichier a été sélectionné
  if (!file) {
    alert("Veuillez sélectionner un fichier");
    return;
  }

  // Lire le fichier en tant que texte
  const reader = new FileReader();
  reader.readAsText(file);

  // Appliquer la fonction de nettoyage lorsque le fichier est lu
  reader.onload = async () => {
    if (reader.error) {
      console.error(reader.error);
      alert("Erreur lors de la lecture du fichier");
      return;
    }

    let data = reader.result; // Récupérer le contenu du fichier au format json

    try {
      data = JSON.parse(data); // Essaye de convertir le json en objet javascript
    } catch (error) {
      console.error(error);
      alert("Le fichier sélectionné n'est pas un fichier JSON valide");
      return;
    }

    const cleanedData = await cleanOxygeneData(data); // Appliquer la fonction de nettoyage sur l'objet passé en paramètre

    const cleanedDataJSON = JSON.stringify(cleanedData); // Convertir les données nettoyées en JSON

    // Créer un lien pour télécharger le fichier nettoyé
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([cleanedDataJSON]));
    link.download = "cleaned_oxygene.json";
    // Afficher le bouton de téléchargement et le lie au lien
    downloadButton.style.display = "inline-block";
    downloadButton.href = link.href;
    downloadButton.download = link.download;
    // Déclenche le téléchargement du fichier nettoyé quand l'utilisateur clique sur le bouton
    downloadButton.addEventListener("click", (e) => {
      e.preventDefault();
      link.click();
    });
  };
});
