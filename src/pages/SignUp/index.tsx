import React, { useCallback, useRef } from 'react';
import {
  FiArrowLeft, FiUser, FiMail, FiLock,
} from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useToast } from '../../hooks/toast';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import logoSvg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {
  Container, Content, AnimationContainer, Background,
} from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      formRef?.current?.setErrors({});
      const validationSchema = yup.object().shape({
        name: yup.string().required('Nome obrigatório.'),
        email: yup.string().email('Digite um e-mail válido.').required('E-mail obrigatório.'),
        password: yup.string().min(6, 'Mínimo de 6 caracteres.'),
      });

      await validationSchema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      addToast({
        title: 'Cadastro realizado!',
        description: 'Você já pode fazer seu logon no GoBarber.',
        type: 'success',
      });
      history.push('/');
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef?.current?.setErrors(errors);
        return;
      }
      addToast({
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro ao fazer cadastro. Tente novamente.',
        type: 'error',
      });
    }
  }, [addToast, history]);

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoSvg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1> Faça seu cadastro </h1>
            <Input icon={FiUser} name="name" placeholder="Nome" />
            <Input icon={FiMail} name="email" placeholder="E-mail" />
            <Input icon={FiLock} name="password" type="password" placeholder="Senha" />

            <Button type="submit">Cadastrar</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
