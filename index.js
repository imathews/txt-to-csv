const fs = require('fs');
const path = require('path');
const csv = require('csv');
const { Transform } = require('stream');

let workdir = __dirname;

if (process.argv[2]){
	workdir = path.join(__dirname, process.argv[2]);
}

const config = require(require.resolve(path.join(workdir, 'config.json')));

const rowEndLength = config.ignoreEndCharacters || 0; // The number of characters, including line breaks, to ignore at the end of each line
const columns = config.columns;
const rowLength = columns.reduce((prev, col) => prev + col.length, rowEndLength);

const files = fs.readdirSync(path.join(workdir, 'inputs'));

transformFilesInSeries(files);

async function transformFilesInSeries(files){
	for (const file of files){
		if (file[0] === '.') continue;
		const startTime = Date.now();
		console.log('=====================');
		console.log(`Parsing file ${file}`);
		await new Promise((resolve, reject) => {
			const readStream = fs.createReadStream(path.join(workdir, 'inputs', file), { encoding: 'ascii' });
			const writeStream = fs.createWriteStream(path.join(workdir, 'outputs', `${file.split('.')[0]}.csv`))
			let leftoverString = '';

			const stringifier = csv.stringify();

			stringifier.pipe(writeStream)
				.on('end', () => console.log('finished'))
				.on('error', reject);

			stringifier.write(columns.map((column) => column.name))

			readStream
				.on('data', (data) => {
					data = leftoverString + data;
					let i;
					const rows = [];
					for (i = 0; i < data.length && i + rowLength <= data.length - rowEndLength; i += rowLength){
						rows.push(data.slice(i, i + rowLength - rowEndLength));
					}
					leftoverString = data.slice(i);
					for (const row of rows){
						let colCounter = 0;
						const record = [];
						for (const column of columns){
							record.push(row.slice(colCounter, colCounter + column.length).trim());
							colCounter += column.length;
						}
						stringifier.write(record);
					}
				})
				.on('end', () => {
					stringifier.end();
					resolve();
				})
				.on('error', reject);
		}).catch(console.log);
		console.log(`Parsed in ${Math.round((Date.now() - startTime)/1000)}s`);
	}
	console.log('=====================');
	console.log('~~DONE!~~');
}













