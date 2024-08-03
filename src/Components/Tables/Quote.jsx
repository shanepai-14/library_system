import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Typography ,Button } from '@mui/material';
const CardWrapper = styled.div`
  width: 600px;
  height: auto;
  margin: 0 auto;
background: rgb(255,255,255);
background: linear-gradient(90deg, rgba(255,255,255,0.8575805322128851) 0%, rgba(250,250,250,0.8071603641456583) 100%);
  border-radius: 8px;
  z-index: 1;
`;

const Tools = styled.div`
  display: flex;
  align-items: center;
  padding: 9px;
`;

const Circle = styled.div`
  padding: 0 4px;
`;

const Box = styled.span`
  display: inline-block;
  align-items: center;
  width: 10px;
  height: 10px;
  padding: 1px;
  border-radius: 50%;
`;

const RedBox = styled(Box)`
  background-color: #ff605c;
`;

const YellowBox = styled(Box)`
  background-color: #ffbd44;
`;

const GreenBox = styled(Box)`
  background-color: #00ca4e;
`;

const CardContent = styled.div`
  padding: 10px;
`;

const QuoteCard = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await axios.get('https://api.api-ninjas.com/v1/quotes?category=education', {
        headers: {
          'X-Api-Key': 'mgDSiqFGa54NlAoDIuspQA==fg02jAnsPS9tWJfP'
        }
      });
      const { quote, author } = response.data[0];
      setQuote(quote);
      setAuthor(author);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  return (
    <CardWrapper>
      <Tools>
        <Circle>
          <RedBox />
        </Circle>
        <Circle>
          <YellowBox />
        </Circle>
        <Circle>
          <GreenBox />
        </Circle>
      </Tools>
      <CardContent>
    <Typography variant='h5' mb={2}>
    {quote}
    </Typography>
        <Typography variant='subtitle2' mb={2}>
        - {author}
        </Typography>
       
       <Button variant='outlined' onClick={fetchQuote}>New Quote</Button>
      </CardContent>
    </CardWrapper>
  );
};

export default QuoteCard;