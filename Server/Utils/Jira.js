const https = require('https');

async function pull_jira_data_all(hostname, user, token) {
  return pull_jira_data(hostname, '', user, token)
}

function stripURL(url) {
  // Regular expression to match "https://", then capture everything until ".net"
  var regex = /^https:\/\/([^\/]+\.net)/;
  
  // Extract the matched part
  var match = url.match(regex);
  
  // If match is found, return the captured group, otherwise return null
  return match ? match[1] : null;
}

async function pull_jira_data(hostname, board_name, user, token) {
  let strippedUrl = stripURL(hostname);

  console.log("strippe:" + hostname + " " + strippedUrl);
  let path = '/rest/api/3/search?';
  if (board_name == '') {
    path = path + 'jql=';
  }
  else {
    path = path + `jql=project=${encodeURIComponent(board_name)}`;
  }

  return new Promise((resolve, reject) => {
    const options = {
      hostname: strippedUrl,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${user}:${token}`).toString('base64')}`
      }
    };
    console.log(options);
    const my_req = https.request(options, (api_res) => {
      console.log(`Status Code: ${api_res.statusCode}`);
    
      let responseData = '';

      api_res.on('data', (data) => {
        responseData += data;
      });

      api_res.on('end', () => {
        resolve(responseData);
      });
    });

    my_req.on('error', (error) => {
      reject(error);
    });

    my_req.end();
  });
}


function extract_issue_count(responseData) {
  // Parse JSON
  const parsedData = JSON.parse(responseData);

  // Extract information from issues
  const issues = parsedData.issues.map(issue => {
    return {
      progress: issue.fields.status.name,
      // Add more fields as needed
    };
  }).reduce((counts, issue) => {
    const stage = issue.progress;
    counts[stage] = (counts[stage] || 0) + 1;
    return counts;
  }, {});
  
  return issues;
}

function extract_users(responseData) {
  const parsedData = JSON.parse(responseData);

  const users = parsedData.issues.map(issue => {
    if (issue.fields.assignee != null) {
      return {
        user: issue.fields.assignee.displayName
      };
    }
    else {
      return {
        user: 'Unassigned'
      }
    }
  })
  .reduce((counts, issue) => {
    const stage = issue.user;
    counts[stage] = (counts[stage] || 0) + 1;
    return counts; 
  }, {});

  return users;
}


module.exports = { extract_issue_count, pull_jira_data, pull_jira_data_all, extract_users};