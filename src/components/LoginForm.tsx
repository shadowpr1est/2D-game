import { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: #232323;
  padding: 2rem 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 16px #0008;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #444;
  font-size: 1.1rem;
  background: #181818;
  color: #fff;
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  border: none;
  background: #3a7afe;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #2556b8;
  }
`;

interface LoginFormProps {
  onSubmit: (name: string) => void;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 style={{ color: '#fff', margin: 0 }}>Enter your name</h2>
      <Input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        maxLength={20}
        autoFocus
      />
      <Button type="submit">Play</Button>
    </Form>
  );
}; 