import axios from 'axios';

export async function setUrlEntry(API_Url, url, alias) {
  const res = await axios({
    method: 'POST',
    url: API_Url + '/url',
    data: JSON.stringify({
      url,
      alias,
    }),
    headers: {
      'content-type': 'application/json',
    },
  });
  return res;
}
