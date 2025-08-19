import fetch from "node-fetch";
const TOKEN = "7377674488:AAGMC0wi0FDGphIO38Da_XRt3nEoUMVE7Lk"; 
const API_URL = `https://api.telegram.org/bot${TOKEN}`;
const fetchProducts = async (req, res) => {
    try {
        console.log('Fetching updates from Telegram API...');
        const response = await fetch(`${API_URL}/getUpdates`);
        const data = await response.json();
        
        console.log('Raw Telegram API response:', JSON.stringify(data, null, 2));

        if (!data.ok) {
            console.error('Telegram API Error:', data.description);
            return res.status(500).json({ 
                error: 'Telegram API error',
                details: data.description 
            });
        }

        if (!data.result || data.result.length === 0) {
            console.log('No updates found. Make sure:');
            console.log('1. The bot is added to the channel as admin');
            console.log('2. The channel has some posts');
            console.log('3. The bot has read access to the channel');
            return res.json([]);
        }

        const products = data.result
            .filter(update => update.channel_post)
            .map(update => {
                const post = update.channel_post;
                console.log('Processing post:', post.message_id, post.text || '[No text]');

                let text = post.text || '';
                let image = null;
                
                if (post.photo) {
                    const fileId = post.photo[post.photo.length - 1].file_id;
                    image = `${API_URL}/getFile?file_id=${fileId}`;
                    console.log('Found image in post:', image);
                }

                return {
                    text,
                    image,
                    date: new Date(post.date * 1000),
                    message_id: post.message_id
                };
            });

        console.log(`Processed ${products.length} products`);
        res.json(products);
    } catch (error) {
        console.error('Error in fetchProducts:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
};
  
          export default fetchProducts