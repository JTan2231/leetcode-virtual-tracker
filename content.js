function colorDiv(slug) {
    let element = document.querySelector(`a[data-contest-title-slug="${slug}"]`);

    if (element) {
        let grandparent = element.parentElement.parentElement;
        grandparent.style.backgroundColor = 'black';
    } else {
        console.log('Element with the specified slug not found.');
    }

}

browser.runtime.sendMessage(
    { "action": "getCookie", "url": "https://leetcode.com", "name": "LEETCODE_SESSION" },
    (response) => {
        if (browser.runtime.lastError) {
            console.error("Error fetching cookie from background:", browser.runtime.lastError);
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
                        colorDiv(o.contest.titleSlug);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }
);


