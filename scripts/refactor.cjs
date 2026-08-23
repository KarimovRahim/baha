const fs = require('fs');

const path = 'src/pages/MenuPage.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { Link } from 'react-router-dom'",
  "import { Link } from 'react-router-dom'\nimport { supabase } from '../lib/supabase'\nimport { useEffect } from 'react'"
);

// Remove the hardcoded categories and productsData
const catRegex = /const categories = \[\n(?:.*\n)*?\]\n/;
content = content.replace(catRegex, '');

const prodRegex = /const productsData: Record<number, any\[\]> = \{\n(?:.*\n)*?\}\n/;
content = content.replace(prodRegex, '');

const menuPageStart = 'const MenuPage = () => {';

const replacementState = `const MenuPage = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [productsData, setProductsData] = useState<Record<number, any[]>>({})
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: catsData, error: catsError } = await supabase.from('categories').select('*').order('id')
        if (catsError) throw catsError
        
        const { data: prodsData, error: prodsError } = await supabase.from('products').select('*').order('id')
        if (prodsError) throw prodsError

        const mappedCategories = (catsData || []).map(c => ({
          id: c.id,
          name: c.name,
          image: c.image_url,
          count: c.item_count
        }))

        const mappedProductsData: Record<number, any[]> = {}
        mappedCategories.forEach(c => {
          mappedProductsData[c.id] = []
        })

        ;(prodsData || []).forEach(p => {
          if (!mappedProductsData[p.category_id]) {
             mappedProductsData[p.category_id] = []
          }
          mappedProductsData[p.category_id].push({
            id: p.id,
            category_id: p.category_id,
            name: p.name,
            description: p.description,
            price: p.price,
            weight: p.weight,
            calories: p.calories,
            ingredients: p.ingredients,
            image: p.image_url
          })
        })

        setCategories(mappedCategories)
        setProductsData(mappedProductsData)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])
`;

content = content.replace(menuPageStart, replacementState);

fs.writeFileSync(path, content, 'utf8');
console.log('done!');
