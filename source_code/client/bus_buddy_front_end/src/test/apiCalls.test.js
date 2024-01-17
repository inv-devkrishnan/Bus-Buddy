// apiCalls.test.js
import { login, loginWithGoogle,getAcessToken,deleteUserAccount,changePassword } from '../utils/apiCalls';
import { axiosApi } from '../utils/axiosApi';

jest.mock('../utils/axiosApi');

describe('API Calls', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('login - successful API call', async () => {
    axiosApi.post.mockResolvedValueOnce({ data: 'success' });

    const result = await login({ username: 'test', password: 'password' });

    expect(result).toEqual({ status: true, message: 'success' });
    expect(axiosApi.post).toHaveBeenCalledWith('account/local-login/', { username: 'test', password: 'password' });
  });

  it('login - failed API call', async () => {
    const error = new Error('Failed');
    axiosApi.post.mockRejectedValueOnce(error);

    const result = await login({ username: 'test', password: 'password' });

    expect(result).toEqual({ status: false, message: error });
    expect(axiosApi.post).toHaveBeenCalledWith('account/local-login/', { username: 'test', password: 'password' });
  });

  it('loginWithGoogle - successful API call', async () => {
    axiosApi.post.mockResolvedValueOnce({ data: 'success' });

    const result = await loginWithGoogle({ cred_token: 'some_token' });

    expect(result).toEqual({ status: true, message: 'success' });
    expect(axiosApi.post).toHaveBeenCalledWith('account/google-login/', { cred_token: 'some_token' });
  });

  it('loginWithGoogle - failed API call', async () => {
    const error = new Error('Failed');
    axiosApi.post.mockRejectedValueOnce(error);

    const result = await loginWithGoogle({ cred_token: 'some_token' });

    expect(result).toEqual({ status: false, message: error });
    expect(axiosApi.post).toHaveBeenCalledWith('account/google-login/', { cred_token: 'some_token' });
  });
  it('deleteUserAccount - successful API call', async () => {
    axiosApi.put.mockResolvedValueOnce({ data: 'success' });

    const result = await deleteUserAccount();

    expect(result).toEqual({ status: true, message: 'success' });
    expect(axiosApi.put).toHaveBeenCalledWith('account/delete-account/');
  });

  it('deleteUserAccount - failed API call', async () => {
    const error = new Error('Failed');
    axiosApi.put.mockRejectedValueOnce(error);

    const result = await deleteUserAccount();

    expect(result).toEqual({ status: false, message: error });
    expect(axiosApi.put).toHaveBeenCalledWith('account/delete-account/');
  });


  it('changePassword - successful API call', async () => {
    axiosApi.put.mockResolvedValueOnce({ data: 'success' });

    const result = await changePassword({ old_password: 'old_pass', new_password: 'new_pass' });

    expect(result).toEqual({ status: true, message: 'success' });
    expect(axiosApi.put).toHaveBeenCalledWith('account/change-password/', { old_password: 'old_pass', new_password: 'new_pass' });
  });

  it('changePassword - failed API call', async () => {
    const error = new Error('Failed');
    axiosApi.put.mockRejectedValueOnce(error);

    const result = await changePassword({ old_password: 'old_pass', new_password: 'new_pass' });

    expect(result).toEqual({ status: false, message: error });
    expect(axiosApi.put).toHaveBeenCalledWith('account/change-password/', { old_password: 'old_pass', new_password: 'new_pass' });
  });

  it('getAcessToken - successful API call', async () => {
    const expectedResult = 'some_access_token';

    axiosApi.post.mockResolvedValueOnce({ data: { access: expectedResult } });

    const result = await getAcessToken();
    console.log(result)
  });

  it('getAcessToken - failed API call', async () => {
    const error = new Error('Failed');
    axiosApi.post.mockRejectedValueOnce(error);

    const result = await getAcessToken();
    console.log(result)
  });

  // Similar test cases for other functions (loginWithGoogle, getAcessToken, deleteUserAccount, changePassword)
});
