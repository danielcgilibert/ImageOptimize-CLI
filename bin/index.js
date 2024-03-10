import yargs from 'yargs'
import sharp from 'sharp'
import chalk from 'chalk'
import boxen from 'boxen'
import fs from 'fs'

const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  borderColor: 'green',
}

const argv = yargs(process.argv.slice(2))
  .option('directory', {
    alias: 'd',
    describe: 'The directory path to search for images',
    type: 'string',
    demandOption: true,
  })
  .option('format', {
    alias: 'f',
    describe: 'The format to output the images',
    type: 'string',
    demandOption: true,
  })
  .help().argv

console.log(boxen(chalk.greenBright('Optimizing images...'), { padding: 1 }))

const removeExtension = (filename) => {
  return filename.split('.').slice(0, -1).join('.')
}
const optimizeImage = async (directory, image, format) => {
  const input = `${directory}/${image}`
  const output = `${directory}/optimized/${removeExtension(image)}`
  await sharp(input)
    .toFormat(String(format))
    .toFile(output + '.' + format)
  console.log(chalk.greenBright(`Optimized ${image}`))
}

const images = await fs.promises
  .readdir(argv.directory)
  .then((files) => files.filter((file) => file.match(/\.(jpg|jpeg|png)$/i)))
await fs.promises
  .mkdir(`${argv.directory}/optimized`, { recursive: true })
  .catch(console.error)
for (const image of images) {
  await optimizeImage(argv.directory, image, argv.format)
}
