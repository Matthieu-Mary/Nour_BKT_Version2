// Appliquer des transformations et des nettoyages sur les données ici
function cleanTemperatureData(data) {

    // Filtre dans un premier temps la data par qualité
    const newDataByQuality = data.filter((item) => parseInt(item.Quality) === 1);
  
    //   Puis par valeur (ici la température)
    const finalData = [];

  
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
  
    // Lire le fichier en tant que texte
    const reader = new FileReader();
    reader.readAsText(file);
  
    // Appliquer la fonction de nettoyage lorsque le fichier est lu
    reader.onload = () => {
      let data = reader.result; // Récupérer le contenu du fichier
      try {
        data = JSON.parse(data); // Essayer de parser le contenu en JSON
      } catch (error) {
        console.error(error);
        alert("Le fichier sélectionné n'est pas un fichier JSON valide");
        return;
      }
  
      const cleanedData = cleanTemperatureData(data); // Appliquer la fonction de nettoyage
      const cleanedDataJSON = JSON.stringify(cleanedData); // Convertir les données nettoyées en JSON
  
      // Créer un lien pour télécharger le fichier nettoyé
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([cleanedDataJSON]));
      link.download = "cleaned_temperature.json";
      // Afficher le bouton de téléchargement et le lie au lien
      downloadButton.style.display = "inline-block";
      downloadButton.href = link.href;
      downloadButton.download = link.download;
      // Déclenche le téléchargement du fichier nettoyé quand l'utilisateur clique sur le bouton
      downloadButton.addEventListener("click", (e) => {
          e.preventDefault();
          link.click()
      })
      
    };
  });