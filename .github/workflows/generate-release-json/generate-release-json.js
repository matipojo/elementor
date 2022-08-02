'use strict';

const { repoToOwnerAndOwner } = require('../../scripts/repo-utils');
const { Octokit } = require("@octokit/rest");
const { promises: fs } = require("fs");
const { REPOSITORY, TOKEN, TAG_NAME_FILTER } = process.env;
const octokit = new Octokit({ auth: TOKEN });

(async () => {
	try {
		const { owner, repo } = repoToOwnerAndOwner(REPOSITORY);
		const releases = await octokit.rest.repos.listReleases({
			owner,
			repo,
			per_page: 100
		});
		console.log('Releases URL: ' + releases.url);
		console.log('Number of releases: ' + releases.data.length);
		let cloudReleases = releases.data.filter(release => release.tag_name.includes(TAG_NAME_FILTER));
		if (!cloudReleases) {
			throw new Error(`No releases found with tag name containing "${TAG_NAME_FILTER}"`);
		}

		console.log('Number of cloud releases: ' + cloudReleases.length);

		const releasesJson = JSON.stringify(cloudReleases, null, 2);
		const releasesDir = `./releases`;
		const releasesFilePath = `${releasesDir}/${TAG_NAME_FILTER}.json`;
		// get real path to releases dir
		const realReleasesDir = await fs.realpath(releasesDir);
		console.log(`Real path to releases dir: ${realReleasesDir}`);
		// Ensure the releases' directory exists
		await fs.mkdir(`${realReleasesDir}`, { recursive: true });
		// log if dir exist
		console.log(`${realReleasesDir} exists: ${fs.existsSync(realReleasesDir)? 'yes' : 'no'}`);

		console.log(`Saving ${releasesFilePath}`);
		// Ensure the releases' directory exists
		await fs.mkdir(`${releasesDir}`, { recursive: true });
		await fs.writeFile(releasesFilePath, releasesJson);
		console.log(`Saved ${releasesFilePath}`);
		process.exit(0);
	} catch (err) {
		console.error( err )
		console.error(`Failed to update cloudReleases.json: ${err}`);
		process.exit(1);
	}
})();
