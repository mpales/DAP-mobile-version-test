export const onChangedText = (text, dispatch) => {
  console.log('test');
  dispatch({
    type: 'todos',
    payload: {num: text},
  });
};
