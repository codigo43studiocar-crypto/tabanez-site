export default function Head() {
  return (
    <>
      <title>Galeria de Fotos e Vídeos — Carlos Tabanez</title>
      <meta
        name="description"
        content="Confira imagens e vídeos das ações, eventos, visitas, fiscalizações e presença do Carlos Tabanez nas comunidades do Distrito Federal."
      />
      <meta name="keywords" content="Tabanez, Galeria, Ações, Fotos, Vídeos, Fiscalização, Eventos, Comunidade" />

      {/* Open Graph */}
      <meta property="og:title" content="Galeria — Carlos Tabanez" />
      <meta
        property="og:description"
        content="Fotos e vídeos das ações e atividades do Carlos Tabanez no Distrito Federal."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://seusite.com/galeria" />
      <meta property="og:image" content="https://seusite.com/og-galeria.jpg" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
