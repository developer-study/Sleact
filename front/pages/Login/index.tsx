import React, { useCallback, useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { Redirect } from 'react-router';
import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/LogIn/styles';
import { Link } from 'react-router-dom';

const Login = () => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post('http://localhost:3095/api/users/login', { email, password }, { withCredentials: true })
        .then((response) => {
          mutate(response.data, false);
        })
        .catch((error) => {
          console.log(error.response);
          setLogInError(error.response?.data?.statusCode === 401);
        })
        .finally(() => {});
    },
    [email, password],
  );

  if (data === undefined) {
    return <div></div>;
  }
  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={(e) => onChangeEmail(e)} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => onChangePassword(e)}
            />
          </div>
          {logInError && <Error>이메일 또는 비밀번호가 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default Login;
