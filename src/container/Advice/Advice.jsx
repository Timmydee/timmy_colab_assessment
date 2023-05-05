import { useEffect, useState } from 'react';
import './Advice.scss'

const Advice = () => {
  const [advice, setAdvice] = useState([]);
  const [reload, setReload] = useState(true);
//   const [loading, setLoading] = useState(true)

  const fetchAdvice = async () => {
    setReload(true)
    const api = 'https://api.adviceslip.com/advice';

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchUniqueAdvice = async (existingAdvice) => {
      while (true) {
        const response = await fetch(api);
        if (response.ok) {
          const data = await response.json();
          const newAdvice = data.slip.advice;
          if (!existingAdvice.includes(newAdvice)) {
            return newAdvice;
          }
        } else {
          throw new Error('Failed to fetch advice');
        }
        await delay(500);
      }
    };

    try {
      const adviceArray = [];

      for (let i = 0; i < 3; i++) {
        const newAdvice = await fetchUniqueAdvice(adviceArray);
        adviceArray.push(newAdvice);
        await delay(500);
      }

      setAdvice(adviceArray);
      setReload(false)
    } catch (error) {
      console.error(error);
      setReload(false)
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className='advice'>
        <div className='advice_col'>
            <h1 className="sub-text"><span>Daily Advice Dosage</span></h1>
            <p className="p-text"> I have included this section to provide people with random pieces of advice that I believe will be helpful in the long run. Additionally, I see this as an opportunity to 
                contribute to mental health awareness by utilizing data from the advice slip API.
                </p>
            
            <div className='advice_item'>
                {reload ? 
                    <img src='/Spinner.gif' />
                    :
                    <ul>
                        {advice.map((adviceItem, index) => (
                        <li key={index}>{adviceItem}</li>
                        ))}
                    </ul>
                }
            </div>
            <button onClick={fetchAdvice} className='btn'>Reload</button>
        </div>
    </div>
  );
};

export default Advice;
