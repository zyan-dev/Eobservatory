export const convertParam = (param) => {
  const formBody = [];
  for (const property in param) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(param[property]);
    formBody.push(`${encodedKey}=${encodedValue}`);
  }
  return formBody.join('&');
};

export const callAPIWithoutToken = (url, param, method) => new Promise((resolve) => {
  fetch(
    url,
    method === 'POST' ? {
      method,
      headers: {
        "Content-Type": 'application/json',
      },
      body: convertParam(param),
    } : {
      method,
    },
  )
  .then(data => data.json())
  .then((res) => resolve(res))
  .catch((e) => console.log(e.toString()));
})
  