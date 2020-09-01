# app-web-explorer

VueJS web app for browsing Pryv.io data.

_Prerequisites:_ 
- Node v12+
- Yarn v1+

## How to?

| Task                              | Command                        |
| --------------------------------- | ------------------------------ |
| Install dependencies              | `yarn install`                 |
| Setup dev environment             | `yarn serve`                   |
| Create distribution               | `yarn build`                   |
| Publish distribution              | `yarn run publish`             |
| Clear distribution                | `yarn clear`                   |
| Run eslint                        | `yarn lint`                    |

### Publish to github pages

If it is the first time you publish app-web-explorer, be sure to run `yarn serve` once.

Create a distribution with your changes by running `yarn build`.

Then, publish your changes by running `yarn run publish`

If you encounter conflicts while publishing, run `yarn clear` to reset the `dist/` folder,
then build and publish again.
