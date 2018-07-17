import React from 'react';
import { View } from 'react-native';
import {
  Button,
  Text,
  Form,
  Input,
  Item,
  Content,
  Container,
  Label
} from 'native-base';
import { Col, Grid } from "react-native-easy-grid";

const LoginForm = props => (
  <View>
    <Form style={props.formStyle}>
      <Item floatingLabel success={props.emailSuccess} error={props.emailError}>
        <Label>Email</Label>
        <Input
          onChangeText={props.changeEmailState}
        />
      </Item>
      <Item floatingLabel success={props.passwordSuccess} error={props.passwordError} last>
        <Label>Password</Label>
        <Input
          secureTextEntry={true}
          onChangeText={props.changePasswordState}
        />
      </Item>
      <Button block style={props.buttonStyle} onPress={props.onPressed}>
        <Text>Login</Text>
      </Button>
        <Grid>
          <Col>
          <Button transparent style={props.signUpStyle} onPress={props.toSignUp}>
            <Text>Create account</Text>
          </Button>
          </Col>

          <Button transparent style={props.forgotPasswordStyle} onPress={props.toForgotPassword}>
            <Text>Forgot password</Text>
          </Button>
        </Grid>
    </Form>
  </View>
);

export default LoginForm;