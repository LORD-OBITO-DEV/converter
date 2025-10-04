import React from 'react'

export default function Legal(){
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl">Mentions légales & politiques</h2>
      <section>
        <h3 className="font-semibold">Conditions générales d'utilisation</h3>
        <p>Le service permet de convertir des vidéos en audio/vidéo. Vous restez responsable du contenu et du respect des droits d'auteur. N'utilisez le service que pour du contenu dont vous détenez les droits ou qui est libre de droits.</p>
      </section>
      <section>
        <h3 className="font-semibold">Politique de confidentialité</h3>
        <p>Nous stockons votre email et vos fichiers convertis. Les fichiers publics peuvent être accessibles via un lien direct. Pour suppression, contactez le support.</p>
      </section>
      <section>
        <h3 className="font-semibold">Mentions légales</h3>
        <p>Nom de l'entité: Convertisseur - Fondateur: Ton Nom - Contact: ton.email@example.com</p>
      </section>
    </div>
  )
}
