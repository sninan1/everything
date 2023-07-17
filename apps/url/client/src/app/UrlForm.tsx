// components/UrlForm.tsx
import React, { FormEvent, useCallback, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import Shortened from './types';

type UrlFormProps = {
  onSubmit: (url: Shortened) => void;
};

const UrlForm: React.FC<UrlFormProps> = ({ onSubmit }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!inputUrl) {
        setError('URL is required');
        return;
      }
      try {
        const response = await axios.post(
          'http://localhost:3333/api/shorten',
          { original: inputUrl }
        );
        const newUrl: Shortened = response.data; // Ensure response.data is of type Shortened
        onSubmit(newUrl);
        setInputUrl('');
      } catch (error) {
        setError('Invalid URL');
      }
    },
    [inputUrl, onSubmit]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
    setError('');
  };

  return (
    <Box mt={8}>
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={!!error}>
          <FormLabel>URL</FormLabel>
          <Input
            id="url-input"
            size="lg"
            value={inputUrl}
            onChange={handleInputChange}
            placeholder="www.my-super-long-url-here.com/12345"
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
        <Button id="submit-btn" type="submit" mt={4} colorScheme="blue">
          Generate
        </Button>
      </form>
    </Box>
  );
};

export default UrlForm;
