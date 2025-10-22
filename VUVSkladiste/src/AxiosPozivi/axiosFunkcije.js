import axios from 'axios';

export async function AxiosGet(url) {
    var data=[];
    await axios({
        method: 'get',
        url: url,
    })
        .then(function (response) {
            data = response.data;
        });

    return data;
}