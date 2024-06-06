const https = require('https');

async function pull_jira_data_all(hostname, user, token) {
  return pull_jira_data(hostname, '', user, token)
}

function stripURL(url) {
  var regex = /^(?:https?:\/\/)?([^\/]+\.net)(?:\/[^\/]*)?/;
  var match = url.match(regex);
  return match ? match[1] : null;
}

async function pull_jira_data(hostname, board_name, user, token) {
  let strippedUrl = stripURL(hostname);

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
    const my_req = https.request(options, (api_res) => {
    
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
  const issues = JSON.parse(responseData).issues.map(issue => {
    return { progress: issue.fields.status.name };
  }).reduce((counts, issue) => {
    const stage = issue.progress;
    counts[stage] = (counts[stage] || 0) + 1;
    return counts;
  }, {});
  
  return issues;
}

function extract_users(responseData) {
  const users = JSON.parse(responseData).issues.map(issue => {
    if (issue.fields.assignee != null) {
      return { user: issue.fields.assignee.displayName };
    }
    else {
      return { user: 'Unassigned' };
    }
  })
  .reduce((counts, issue) => {
    const stage = issue.user;
    counts[stage] = (counts[stage] || 0) + 1;
    return counts; 
  }, {});

  return users;
}

function extract_boards(responseData) {
  const boards = JSON.parse(responseData).issues.map(issue => issue.fields.project.key)
  .filter((board, index, self) =>
    index === self.findIndex(b => (
      b === board
    ))
  );

  return boards;
}




module.exports = { extract_issue_count, pull_jira_data, pull_jira_data_all, extract_users, extract_boards};