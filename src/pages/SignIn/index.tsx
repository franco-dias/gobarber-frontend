import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErrors';
import logoSvg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container, Content, AnimationContainer, Background,
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { signIn } = useAuth();

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef?.current?.setErrors({});
      const validationSchema = yup.object().shape({
        email: yup.string().email('Digite um e-mail válido.').required('E-mail obrigatório.'),
        password: yup.string().required('Senha obrigatória.'),
      });

      await validationSchema.validate(data, {
        abortEarly: false,
      });

      await signIn({
        email: data.email,
        password: data.password,
      });

      addToast({
        title: 'Autenticado com sucesso!',
        type: 'success',
      });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef?.current?.setErrors(errors);
        return;
      }
      addToast({
        title: 'Erro na autenticação',
        description: 'Verifique as credenciais de acesso.',
        type: 'error',
      });
    }
  }, [signIn, addToast]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoSvg} alt="GoBarber" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1> Faça seu logon </h1>
            <Input icon={FiMail} name="email" placeholder="E-mail" />

            <Input icon={FiLock} name="password" type="password" placeholder="Senha" />

            <Button type="submit">Entrar</Button>

            <a href="forgot">Esqueci minha senha</a>
          </Form>
          <Link to="signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
