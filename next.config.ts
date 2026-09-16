import type { NextConfig } from "next";

import { TAMANHO_MAXIMO_ARQUIVO } from "./lib/limites";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      /**
       * O painel envia imagens e PDFs por Server Action. O padrão do Next é
       * 1 MB, abaixo do limite de 8 MB por arquivo que o painel anuncia — o
       * corpo era recusado antes de a action rodar, e esse erro não dá para
       * capturar. Folga de 1 MB cobre o overhead do multipart e os demais
       * campos do formulário (inclusive o corpo em HTML da notícia).
       */
      bodySizeLimit: TAMANHO_MAXIMO_ARQUIVO + 1024 * 1024,
    },
  },
};

export default nextConfig;
