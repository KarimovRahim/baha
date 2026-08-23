const fs = require('fs');

const path = 'src/pages/MenuPage.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("import { supabase } from '../lib/supabase'\\nimport { useEffect } from 'react'", "import { supabase } from '../lib/supabase'");

content = content.replace(
  ".find((p: any) => p.id === parseInt(productId))",
  ".find((p: any) => p.id === parseInt(productId)) as any"
);

content = content.replace(
  /<GiChefToque size=\{([0-9]+)\} fill=['"]([^'"]+)['"] \/>/g,
  "<GiChefToque size={$1} color='$2' />"
);

fs.writeFileSync(path, content, 'utf8');
