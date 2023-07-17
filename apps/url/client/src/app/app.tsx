import React, { useState } from 'react';
import { Container, Heading, Box, Text, Spinner} from '@chakra-ui/react';
import UrlForm from './UrlForm';
import UrlList from './UnorderedList';
import Shortened from './types';

export function App() {
  const [urls, setUrls] = useState<Shortened[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('')

  const handleUrlSubmit = async (url: Shortened) => {
    try{ 
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUrls((prevUrls) => [url, ...prevUrls]);
    } catch (error: any) {
      setLoading(false);

      setError('Failed to submit URL'+ error.message)
    } 
  };

  return (
    <Container maxWidth="10xl" marginBlock={1} textAlign="center">
      <Heading>My URL Shortener</Heading>
      <UrlForm onSubmit={handleUrlSubmit} />
      {loading ? ( 
        <Box mt={4}>
          <Spinner size="x1"/>
          <Text mt = {2}> submitting url...  </Text>
        </Box>
      ): null}
      {error ? (
        <Box mt={4} color="red">
          <Text> {error} </Text>
        </Box>
      ): null }
      <UrlList urls={urls} />
    </Container>
  );
}

export default App;
