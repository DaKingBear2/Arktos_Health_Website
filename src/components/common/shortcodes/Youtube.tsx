import React, { useEffect, useState } from "react";

const Youtube = ({
  id,
  title,
  ...rest
}: {
  id: string;
  title: string;
  [key: string]: any;
}) => {
  const [LiteYouTubeEmbed, setLiteYouTubeEmbed] = useState<any>(null);

  useEffect(() => {
    import("react-lite-youtube-embed").then((mod: any) => {
      import("react-lite-youtube-embed/dist/LiteYouTubeEmbed.css");
      const Embed = mod.LiteYouTubeEmbed || mod.default || mod;
      setLiteYouTubeEmbed(() => Embed);
    });
  }, []);

  if (!LiteYouTubeEmbed) {
    return <div className="yt-lite rounded-lg bg-gray-200 h-64 animate-pulse" />;
  }

  return (
    <LiteYouTubeEmbed
      wrapperClass="yt-lite rounded-lg"
      id={id}
      title={title}
      {...rest}
    />
  );
};

export default Youtube;
