/**
 * 将一组表单元素转化为对象
 * @param form {HTMLFormElement} 表单对象
 * @return {Object}
 */
function formToObject(form) {
  return Array.from(new FormData(form)).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: value,
    };
  }, {});
}