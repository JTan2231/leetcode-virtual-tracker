function colorDiv(slug,count) {
    let element = document.querySelector(`a[data-contest-title-slug="${slug}"]`);

    if (element) {
        let grandparent = element.parentElement.parentElement;
        if (count == 4) {
            grandparent.style.backgroundColor = '#143d11';
        } else {
            grandparent.style.backgroundColor = '#818739';
        }
        
    } else {
        setTimeout(() => colorDiv(slug), 500);
        console.log('Element with the specified slug not found.');
    }
}

function clearDivs() {
    let completedContests = document.querySelectorAll('div[style="background-color: rgb(20, 61, 17);"]');
    let partiallyCompletedContests = document.querySelectorAll('div[style="background-color: rgb(129, 135, 57);"]');
    completedContests.forEach(element => {
        element.style.backgroundColor = '';
    });
    partiallyCompletedContests.forEach(element => {
        element.style.backgroundColor = '';
    });
}

chrome.runtime.sendMessage(
    { "action": "getCookie", "url": "https://leetcode.com", "name": "LEETCODE_SESSION" },
    (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error fetching cookie from background:", chrome.runtime.lastError);
        } else if (response) {
            console.log("Received cookie:", response.value);
            const cookie = 'LEETCODE_SESSION=' + response.value;
            const endpoint = 'https://leetcode.com/graphql/';
            const headers = {
                'Content-Type': 'application/json',
                'Cookie': cookie
            };

            const body = JSON.stringify({
                'operationName': 'myVirtualContests',
                'query': 'query myVirtualContests($pageNo: Int, $numPerPage: Int) {  allVirtualContestScoresPagified(pageNo: $pageNo, numPerPage: $numPerPage) {    pageNum    numPerPage    totalNum    currentPage    data {      contest {        title        titleSlug        originStartTime      }      startTime      score      totalScore      finishTime      totalAcQuestions      totalQuestions      ranking      totalUsers    }  }}',
                'variables': {
                    'numPerPage': 500,
                    'pageNo': 1
                }
            });

            fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: body
            }).then(res => res.json())
                .then(data => {
                    console.log(data);
                    for (const o of data.data.allVirtualContestScoresPagified.data) {
                        colorDiv(o.contest.titleSlug,o.totalAcQuestions);
                    }
                    localStorage.setItem('virtuals', JSON.stringify(data));
                })
                .catch(error => console.error('Error:', error));
        }
    }
);

document.body.addEventListener('click', (event) => {
    let content = event.target.textContent.trim();
    if (!isNaN(content) || content == "<" || content == ">") {
        clearDivs();
        setTimeout(() => {console.log("Waiting for contests to load"),1000});

        const storedData = localStorage.getItem('virtuals');
        
        if (storedData) {
            const keyValueArray = JSON.parse(storedData);
            for (const o of keyValueArray.data.allVirtualContestScoresPagified.data) {
                colorDiv(o.contest.titleSlug);
            }
        }
    }
});