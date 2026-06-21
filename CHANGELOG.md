# Changelog

## [1.11.0](https://github.com/dev-murphy/formjam/compare/v1.10.0...v1.11.0) (2026-06-21)


### Features

* add form responses dashboard with analytics views ([405c5e4](https://github.com/dev-murphy/formjam/commit/405c5e4a26036e6cb907db9945a04873f77876f9))


### Miscellaneous

* **main:** formatted codebase ([909c1d4](https://github.com/dev-murphy/formjam/commit/909c1d4102e63d5f2ad7628465db4b2c88bd8336))


### CI/CD

* add desktop release workflow for Tauri app ([275e9a5](https://github.com/dev-murphy/formjam/commit/275e9a51277c080c953d835b660500ba4fb2eae9))
* use PAT for release-please so it triggers the desktop build ([e3312c7](https://github.com/dev-murphy/formjam/commit/e3312c71b30e20568b06f8a0234a349d1fcb9217))


### Build System

* migrate Tauri desktop app from v1 to v2 ([b900295](https://github.com/dev-murphy/formjam/commit/b9002954d3685364ccd851d2ec44dd29fc202abc))

## [1.10.0](https://github.com/dev-murphy/formjam/compare/v1.9.0...v1.10.0) (2026-06-21)


### Features

* add question validation config and new question types ([20de926](https://github.com/dev-murphy/formjam/commit/20de926b3dc121df26b84794ca627e061eb2d61e))
* added response heading and response section ([8c8124f](https://github.com/dev-murphy/formjam/commit/8c8124fa34c35b360c3cee0b812e08880a41b2a6))
* dismiss dropdown and share modal on outside click ([7299f87](https://github.com/dev-murphy/formjam/commit/7299f87a994173ca5b4d673d6bc267732e7ee5af))
* validate preview answers and guard number input ([6b0d18c](https://github.com/dev-murphy/formjam/commit/6b0d18c7fe2c74c70a924bfb8d0a10f25ae683e3))


### Bug Fixes

* persist multiple-choice options and resolve type errors ([80c6ff5](https://github.com/dev-murphy/formjam/commit/80c6ff54f1db692dd7fdbd1cf2fdb33bf1a49c49))
* resolve breaking changes from Pinia 3, TipTap 3, and PocketBase 0.27 ([dc5cf54](https://github.com/dev-murphy/formjam/commit/dc5cf54af70119d46c4d4e40c1c13e383e6348aa))
* sync pnpm-lock.yaml specifier for @playwright/test to match package.json ([ec899da](https://github.com/dev-murphy/formjam/commit/ec899da5198d060f29de1c15e51ce044fb9341cf))
* update PrimeVue 4 theme to use preset-based configuration ([d629ea8](https://github.com/dev-murphy/formjam/commit/d629ea8e2412c10ed46aa5999d02b29a755fe46b))


### Miscellaneous

* add PocketBase API rules migration ([87ab62a](https://github.com/dev-murphy/formjam/commit/87ab62a99b0743d74423f9157f7a708390d9e497))
* added sections to settings store ([31ca2cd](https://github.com/dev-murphy/formjam/commit/31ca2cdb5846798424126a795cd67161b9db934b))
* hid elements in form navbar based on routes ([ce68ce9](https://github.com/dev-murphy/formjam/commit/ce68ce9bcab93dc1421c9a67237b750f454fbfd7))
* **main:** formatted codebase ([e758726](https://github.com/dev-murphy/formjam/commit/e7587260bb4fd875ffa8ae1f3b8b722b2e4d17b0))
* **main:** formatted codebase ([c7f6527](https://github.com/dev-murphy/formjam/commit/c7f6527cc3f3c68d7f1f00fd2ef4475644aa4a0d))
* **main:** formatted codebase ([485e894](https://github.com/dev-murphy/formjam/commit/485e89430ed21be59beaf64833922dae6d89b6b2))
* migrate from Cypress to Playwright with parallel execution ([a9282cc](https://github.com/dev-murphy/formjam/commit/a9282cc1f05cd63ec2f7497ab3cf2bc2bf663b67))
* migrate Tailwind CSS from v3 to v4 ([55412ba](https://github.com/dev-murphy/formjam/commit/55412ba90d2b0ada361550e4ed0f053fbae45cbc))
* pin Node.js version to 22 ([3eecc39](https://github.com/dev-murphy/formjam/commit/3eecc39eafb8fc7f261904897c40f7a6d0252df8))
* remove Cypress config and spec files ([c5ba726](https://github.com/dev-murphy/formjam/commit/c5ba726511df7414dbc641c881517895b490c1a5))
* removed change password section from profile page ([6696ee4](https://github.com/dev-murphy/formjam/commit/6696ee48d463afeb380a5f5700fe466552b1bd40))
* upgrade all dependencies to latest and pin exact versions ([81eea6a](https://github.com/dev-murphy/formjam/commit/81eea6a16b27dda9a5b024caddd7e4f084895f3f))


### Documentation

* add database schema notes ([95136cc](https://github.com/dev-murphy/formjam/commit/95136cc92558a6a7a58f04bbc1f70defced2b603))


### Code Refactors

* created page title util function ([c65a3e2](https://github.com/dev-murphy/formjam/commit/c65a3e2d3feb8d5e996f3761051fa186413bab12))
* updated theme styles for text based question types ([a2e0ea4](https://github.com/dev-murphy/formjam/commit/a2e0ea45992f2eab50799b3a7bc68b8af13eb1b3))


### Tests

* add e2e coverage for all question type validations ([72c3f85](https://github.com/dev-murphy/formjam/commit/72c3f857656825820f533dc5c572f15cdf96a0dc))
* skip local dev server when targeting a deployed URL ([fd9926e](https://github.com/dev-murphy/formjam/commit/fd9926e452122b99a7bb802e10646cb36e188281))
* stabilize auth e2e and add test-data cleanup ([d161018](https://github.com/dev-murphy/formjam/commit/d161018d6d95b9085936fd595c8bdcb41546e0ac))


### CI/CD

* pass pocketbase and superuser secrets to Playwright job ([498ca9e](https://github.com/dev-murphy/formjam/commit/498ca9e5887267293115b80d70ad6e5a45839ce1))
* replace Cypress workflow with Playwright ([f29bd2d](https://github.com/dev-murphy/formjam/commit/f29bd2ddb6cbdae7522f7183fa55d39d4eddaa2b))
* run e2e against the branch build, not the deployed URL ([1bb2085](https://github.com/dev-murphy/formjam/commit/1bb2085fd6828294eda611c2b5d532e07e89d26b))


### UI Updates

* correct dark/light theming across components and pages ([557adb0](https://github.com/dev-murphy/formjam/commit/557adb0f5896c74d54bc94607285ba8d7bd03a37))

## [1.9.0](https://github.com/M-Facey/formjam/compare/v1.8.3...v1.9.0) (2023-12-20)


### Features

* added preview form page ([fcba406](https://github.com/M-Facey/formjam/commit/fcba406c7024bebd82cd28949646c31c33f94cf5))
* added preview page to router ([be55bd8](https://github.com/M-Facey/formjam/commit/be55bd8f89ab4111755c5a2f7caa4c299d1c891c))
* added profile page personal info change ([7fd72c7](https://github.com/M-Facey/formjam/commit/7fd72c7751ac920825ce027b068a805488b2930b))
* added question duplication ([f04f856](https://github.com/M-Facey/formjam/commit/f04f8568e7902befae28f02eab68731ec39ef5b1))
* page title changed based on route ([b1b4175](https://github.com/M-Facey/formjam/commit/b1b4175b72854f9d0ceaab11b586365e0a0dac08))


### Bug Fixes

* added user type ([1c88b97](https://github.com/M-Facey/formjam/commit/1c88b97438072e7e1722ca778c2a00f409317066))


### Miscellaneous

* added `Answer` and `SubmittedForm` types ([5d704c0](https://github.com/M-Facey/formjam/commit/5d704c0ae3a7c039bbdb56ebf02b9e6d29575411))
* changed localStorage to sessionStorage ([fd2cf2b](https://github.com/M-Facey/formjam/commit/fd2cf2bd8b9e4ffa13b1f6b67386ffc462b42fa0))
* ensured correct navigation to success page ([778b744](https://github.com/M-Facey/formjam/commit/778b744b728f4069d0675a163d250bb10b0697ba))
* **main:** formatted codebase ([e05f737](https://github.com/M-Facey/formjam/commit/e05f737ee1cdedd6276f1e1bf7706a86dda3c286))
* **main:** formatted codebase ([399a1b1](https://github.com/M-Facey/formjam/commit/399a1b1f689b84ded973c1209c7d328e41ad3ed7))
* **main:** formatted codebase ([33da4dc](https://github.com/M-Facey/formjam/commit/33da4dc63e87d0ee5249bbc6c4a57fcb3c4c5a13))
* saved initial answer to database when component mounts ([e2fa4f2](https://github.com/M-Facey/formjam/commit/e2fa4f23bcfd25b35e718ac654eb8937616fe251))
* updated preview url ([f472739](https://github.com/M-Facey/formjam/commit/f472739ea855a153bafa4332eb9632517e0588b0))


### Code Refactors

* added form answer and input util functions ([8aeb330](https://github.com/M-Facey/formjam/commit/8aeb330c262111f37d34dd16722f2ffd8e6e2993))
* moved theme styles from edit page to form layout ([4de71bc](https://github.com/M-Facey/formjam/commit/4de71bc54b8ca7e1c65cc62eb57de8e676f506ee))
* placed back button beside form title ([1c7a019](https://github.com/M-Facey/formjam/commit/1c7a019367daf529e2982a29d7a7e480b778ce11))
* removed preview logic & added submit functionality ([58e9035](https://github.com/M-Facey/formjam/commit/58e903572d61ba6c9678bffaf19a05865b2f0aa4))
* removed unnecessary routing code ([93b44de](https://github.com/M-Facey/formjam/commit/93b44dec9cb67d484b4aac80acbc71c1e59ea4f5))
* removed unused class styles ([21bf626](https://github.com/M-Facey/formjam/commit/21bf626e5d109d59b20f52e812c3480e9de3b2c6))
* updated import url for FormQuestionList ([3175eba](https://github.com/M-Facey/formjam/commit/3175eba3c51b008973ba34fc326e21d6cb3a1762))

## [1.8.3](https://github.com/M-Facey/formjam/compare/v1.8.2...v1.8.3) (2023-12-15)


### Bug Fixes

* called cancel function on mouse up event ([66132e2](https://github.com/M-Facey/formjam/commit/66132e225e723a243aa8be49fc837e148c590bb6))
* prevented mouse down event on smaller screen ([761ca2d](https://github.com/M-Facey/formjam/commit/761ca2d999d7838d881df65930affc673756ac95))


### Miscellaneous

* **main:** formatted codebase ([62196b0](https://github.com/M-Facey/formjam/commit/62196b08a13506b288640073078fb695faaf7e9b))


### UI Updates

* added `prose` class for description & added bottom padding for the view page ([52f0f4e](https://github.com/M-Facey/formjam/commit/52f0f4edfc01ac68917ec87eb18ed68467234a03))
* added extra bottom padding on smaller screens ([35a0a2d](https://github.com/M-Facey/formjam/commit/35a0a2dd42157177c16c4c440bd4869c293f1df2))
* added theme styles & responsiveness to form navbar ([2e7668c](https://github.com/M-Facey/formjam/commit/2e7668c0c2d8e8ffc6db567f9043b25c013ac503))
* added theme styles to answer component ([174f02d](https://github.com/M-Facey/formjam/commit/174f02d6451f1e1ca44b402f27f4867c1e62cd22))
* added theme styles to create/edit form page ([4cdbd7d](https://github.com/M-Facey/formjam/commit/4cdbd7d96f908c0d31c29c1c79c7450b64367e39))
* added theme styles to editor component ([906461e](https://github.com/M-Facey/formjam/commit/906461eab4596d2d88978caf1289a0244d6fab3b))
* added theme styles to form question component ([c522261](https://github.com/M-Facey/formjam/commit/c52226122d692e6f04d9425aeafeb7ad387d2a68))
* added theme styles to form title component ([4345e66](https://github.com/M-Facey/formjam/commit/4345e66034922d9b389f5d69add12926b9efc12e))
* added theme styles to toggle component ([2ea417c](https://github.com/M-Facey/formjam/commit/2ea417c3322bcf749b6bdf449cb88c6bb60cd584))
* fixed responsiveness for editor controls and character count ([7a771b6](https://github.com/M-Facey/formjam/commit/7a771b63c68978e9342970bfa04cfcd153f88af6))
* made editor input full width ([16e023f](https://github.com/M-Facey/formjam/commit/16e023fb880e64371f86250b479f0196a88954e5))
* made form question responsive ([3417ce1](https://github.com/M-Facey/formjam/commit/3417ce1e871eaddf297eef7bcdc46f9cff1e5208))
* made question controls responsive ([cd698f4](https://github.com/M-Facey/formjam/commit/cd698f4f3db6bf071bfd5ba1e85bef7efded9dcc))
* removed extra padding from form question ([744b1d1](https://github.com/M-Facey/formjam/commit/744b1d1e34506b01b4bc2dc2bb23e76489326a52))

## [1.8.2](https://github.com/M-Facey/formjam/compare/v1.8.1...v1.8.2) (2023-12-14)


### Bug Fixes

* allowed for select mode to triggered of small screen (desktop) ([2fcebd3](https://github.com/M-Facey/formjam/commit/2fcebd331cae90ef04eaf7f623360505560e6a55))
* prevented form card button from triggering select mode ([c667068](https://github.com/M-Facey/formjam/commit/c667068b7389a63ebcb083b6d212dd5badd29e2d))


### Miscellaneous

* added theme toggle to navbars ([5a3fd6f](https://github.com/M-Facey/formjam/commit/5a3fd6f77655d5e72a8becb88a1f7f29c53e30ef))
* **deps:** removed crypto-js ([de23d3c](https://github.com/M-Facey/formjam/commit/de23d3cbb14eb2b0b360237640f799c1954098ab))
* removed unused component ([28b46cf](https://github.com/M-Facey/formjam/commit/28b46cf89793dce97c833a38c24048987c860805))


### UI Updates

* added theme styles to select bar ([a6a5095](https://github.com/M-Facey/formjam/commit/a6a5095d05857a074672188e872b0cf2220cefff))

## [1.8.1](https://github.com/M-Facey/formjam/compare/v1.8.0...v1.8.1) (2023-12-12)


### Bug Fixes

* triggered cancel function on mouse & touch events ([cdf3bf4](https://github.com/M-Facey/formjam/commit/cdf3bf4307fa76bd934554861c76b1c6fc604ee9))


### Miscellaneous

* **deps:** added crypto-js ([da838ce](https://github.com/M-Facey/formjam/commit/da838cea785d59332e9dbe18c800897a3d86345f))
* renamed the theme store to settings ([1cdb858](https://github.com/M-Facey/formjam/commit/1cdb858d85142f6dd596ef7b4eca88aeb305516c))
* used custom `view` v-model ([eaf259a](https://github.com/M-Facey/formjam/commit/eaf259a839a1cde2f2fcef428d4d534c632864b0))


### Code Refactors

* changed theme store imports to settings & updated props for filter tab component ([2d85513](https://github.com/M-Facey/formjam/commit/2d85513c155b054fe4d1ac0382368ed51d2de665))
* updated theme store imports to settings store ([51d9a76](https://github.com/M-Facey/formjam/commit/51d9a762685b3b3d8ace86e71ff794dc67442cb2))

## [1.8.0](https://github.com/M-Facey/formjam/compare/v1.7.1...v1.8.0) (2023-12-10)


### Features

* added select & bulk delete form actions ([91533b7](https://github.com/M-Facey/formjam/commit/91533b7117afc4e2ab739d8a9f1d012ff3b3f138))
* added select & bulk delete form functionality ([a0014d5](https://github.com/M-Facey/formjam/commit/a0014d5d6650aa83cfde635952450af45a6d09ac))
* added tailwind breakpoints ([e1b69dc](https://github.com/M-Facey/formjam/commit/e1b69dc349895d9772a31c3d54f362987e621570))


### Bug Fixes

* `watcher`being triggered for both components ([5a79dbe](https://github.com/M-Facey/formjam/commit/5a79dbebe64476c46b1421993117abe8a928461d))
* changed duration for select function on touch event ([a446435](https://github.com/M-Facey/formjam/commit/a446435e9ca1161650a2f439b9298108c3f1466f))
* prevent deselecting from triggering edit form ([6bf8ae6](https://github.com/M-Facey/formjam/commit/6bf8ae656b89846ae9167026921de7579848fcbf))
* resolved glitchy event when triggering select mode ([7363999](https://github.com/M-Facey/formjam/commit/73639991a37c42a785c8b773fe6b07faecce0feb))
* searching now updates accordingly ([41ddaaf](https://github.com/M-Facey/formjam/commit/41ddaaff94a1fb57c2b5742a33e630a5ad1fe04b))
* triggered cancel function when touch ends ([98888bc](https://github.com/M-Facey/formjam/commit/98888bc9a8f514c7a06f4fb4a2ea21f4ea6952e3))


### Miscellaneous

* aligned buttons to center in delete dialog ([7e9ce6c](https://github.com/M-Facey/formjam/commit/7e9ce6caefdcc2332559a8fd639d4d91e81f84bc))
* **main:** formatted codebase ([2f6c8a6](https://github.com/M-Facey/formjam/commit/2f6c8a6f299ef0f70783da74e0cb94b41a25e321))
* **main:** formatted codebase ([6bfa9eb](https://github.com/M-Facey/formjam/commit/6bfa9eba67aeba3727d45ca38b5962414bb2daba))
* removed console logs & reduced duration for touch event ([890414d](https://github.com/M-Facey/formjam/commit/890414d62eec67355510b485012ae13d5db3ceed))
* updated form type to handle selecting forms ([3e92201](https://github.com/M-Facey/formjam/commit/3e922010615b1e7fae39c3676753e5293def3cf0))
* used touch events for selecting forms on mobile devices ([d3a9af7](https://github.com/M-Facey/formjam/commit/d3a9af7af4a64f9358e6b253a5c14d695fe8f296))


### Code Refactors

* added pure debouncer function ([1c3d00b](https://github.com/M-Facey/formjam/commit/1c3d00bb336271b3b7cefec78ab592413033fb49))
* debounce method now reusable ([25711ff](https://github.com/M-Facey/formjam/commit/25711fffe556a835800bb3fb8207d1889c457cb3))


### CI/CD

* added all changelog types to release action ([67f9a46](https://github.com/M-Facey/formjam/commit/67f9a4668c6bcb8767389422140f611455a7c6ae))
* updated release to improve changelog ([46eae20](https://github.com/M-Facey/formjam/commit/46eae2054f3c3e8a456d6ac7715cbff69a1b709d))


### UI Updates

* made select box responsive ([a460a33](https://github.com/M-Facey/formjam/commit/a460a337abe071be58b7028ce478162bb85c8aad))

## [1.7.1](https://github.com/M-Facey/formjam/compare/v1.7.0...v1.7.1) (2023-12-07)


### Bug Fixes

* added cypress attributes to delete form dialog ([42efb5a](https://github.com/M-Facey/formjam/commit/42efb5ae8113f7c70d2b8d01d0d64e304e527e74))
* added cypress attributes to form card ([914e5c8](https://github.com/M-Facey/formjam/commit/914e5c8746140e8c307e92c114b1249327768340))


### Miscellaneous

* added delete form test & refactored no form test ([4f9ea50](https://github.com/M-Facey/formjam/commit/4f9ea506defac13d0517d51f2aa4421c9b593a34)), closes [#33](https://github.com/M-Facey/formjam/issues/33)
* **main:** formatted codebase ([5406c34](https://github.com/M-Facey/formjam/commit/5406c3464aae26d81af5a8a8ce68d213e8c65ace))

## [1.7.0](https://github.com/M-Facey/formjam/compare/v1.6.2...v1.7.0) (2023-12-06)


### Features

* added search form functionality ([549ca01](https://github.com/M-Facey/formjam/commit/549ca010051cb7fb9ab01a703fdb20a09bf159a6))


### Bug Fixes

* removed duplicate name in release action ([e4b29fb](https://github.com/M-Facey/formjam/commit/e4b29fb9b08ddfb096038f4a6c69ccb7653757c5))


### Miscellaneous

* added name to release action ([0476ecb](https://github.com/M-Facey/formjam/commit/0476ecb6574df55d01206760510cf375a3d3cd2b))
* **deps:** updated dependencies ([f259a41](https://github.com/M-Facey/formjam/commit/f259a4119aed6287652e9363a00d39a614b6d9b1))
* **main:** formatted codebase ([56cb3a4](https://github.com/M-Facey/formjam/commit/56cb3a446ab098cfc67515c910b857d08a6d8ed9))

## [1.6.2](https://github.com/M-Facey/formjam/compare/v1.6.1...v1.6.2) (2023-12-06)


### Miscellaneous

* **deps-dev:** bump vite from 4.4.10 to 4.4.12 ([6f7903e](https://github.com/M-Facey/formjam/commit/6f7903eec7556c36522de8dbca0b93a592472505))
* refactored format & test action into one file ([7e6172a](https://github.com/M-Facey/formjam/commit/7e6172a54df41c2a9172c3958bec85f79a2d9da9))
* renamed format & test action ([ae187f5](https://github.com/M-Facey/formjam/commit/ae187f53312d39589b51fadf03bb127fc8ea14fb))

## [1.6.1](https://github.com/M-Facey/formjam/compare/v1.6.0...v1.6.1) (2023-12-05)


### Bug Fixes

* removed record option ([d075f08](https://github.com/M-Facey/formjam/commit/d075f08e3283716939f3883eee481008234a0469))
* resolved logout command failing ([8fa5235](https://github.com/M-Facey/formjam/commit/8fa52351ca6fd4601cb9a9a53b133a0fb7faf704))


### Miscellaneous

* added branches to cypress action ([4bba7b6](https://github.com/M-Facey/formjam/commit/4bba7b6b40ff94435b76c810d1e5f768d921f220))
* commented out failing test ([f254d3d](https://github.com/M-Facey/formjam/commit/f254d3dd8d19b619ba3ffd2bb32dc2f3fbcea13b))
* removed cypress badge ([b57a916](https://github.com/M-Facey/formjam/commit/b57a916e2436c88fc231ca0e244d1caa8990b276))
* removed cypress record id ([26c81f6](https://github.com/M-Facey/formjam/commit/26c81f67a8516bf3941987f3334b88e288aa0e7c))

## [1.6.0](https://github.com/M-Facey/formjam/compare/v1.5.0...v1.6.0) (2023-12-05)


### Features

* added change password form ([6a89e4b](https://github.com/M-Facey/formjam/commit/6a89e4b5d88242b3419aed192b8bcede0707cc0b))
* added personal info form ([7ecfb9c](https://github.com/M-Facey/formjam/commit/7ecfb9cbd02475ff01b20d4ffd185dc0f38cbeb9))
* added profile page & route ([721f521](https://github.com/M-Facey/formjam/commit/721f521216f2f8c62558da23e940153d34e967fd))


### Miscellaneous

* added prime menu to navbars ([bb9f78c](https://github.com/M-Facey/formjam/commit/bb9f78c1bfe5cd38d09d16a30a21681dc42db514))
* made id mandatory for checkbox input ([e4db604](https://github.com/M-Facey/formjam/commit/e4db604f0d9b15fcd068b93c8b79f584fc38a8bc))
* removed unused icon ([3a5b92a](https://github.com/M-Facey/formjam/commit/3a5b92ae4d3ec5227ad57c966d2f9ce5fe9d5ac7))

## [1.5.0](https://github.com/M-Facey/formjam/compare/v1.4.4...v1.5.0) (2023-12-04)


### Features

* created footer component ([53a823d](https://github.com/M-Facey/formjam/commit/53a823dd31919b302bc5e79ff92975bb4122f4d5))


### Miscellaneous

* added  or changed to use `dvh` ([23bcbb3](https://github.com/M-Facey/formjam/commit/23bcbb3dff96206b180fb48b670218cb84f7d65c))
* added theme styles & primevue menu to form item ([96a40cc](https://github.com/M-Facey/formjam/commit/96a40ccd3e3bee41d539bd1e8bf3bb4be2877294))
* added theme styles to create form component ([534f59a](https://github.com/M-Facey/formjam/commit/534f59a1c7ed5fb8fae5e6f306e37c48c6e9e4d5))
* added theme styles to dashboard filter section ([68a208e](https://github.com/M-Facey/formjam/commit/68a208e9452c1b43c3b9d9909b8ac09900cf20b7))
* added theme styles to dashboard layout ([18c313a](https://github.com/M-Facey/formjam/commit/18c313a4b2956253913598f0ea24b4aaf7044d42))
* added theme styles to form card ([e116b34](https://github.com/M-Facey/formjam/commit/e116b342b336d998ed24e8bb84cfe409f9f7bf84))
* positioned auth forms to center of the screen ([d347557](https://github.com/M-Facey/formjam/commit/d34755708aa20adec5592fc850a2992d4fd35dcc))
* positioned footer at the bottom of the screen ([a632d9f](https://github.com/M-Facey/formjam/commit/a632d9f8a35a9f6536dd43d3b51301be37757ed9))
* removed unused icons ([faab21a](https://github.com/M-Facey/formjam/commit/faab21a07f82560c46e74e00c5f86c4359d0a438))

## [1.4.4](https://github.com/M-Facey/formjam/compare/v1.4.3...v1.4.4) (2023-12-04)


### Bug Fixes

* removed unused element ([6369ac3](https://github.com/M-Facey/formjam/commit/6369ac39a58aa6282e1d58a2b7ac353894d098e2))


### Miscellaneous

* updated .gitignore ([de3b6ef](https://github.com/M-Facey/formjam/commit/de3b6ef3f98431f5ae77e98f67e215bdea157a89))


### Documentation

* added ([65432c0](https://github.com/M-Facey/formjam/commit/65432c04c809671bf07a3656a6a854c7987f6a51))

## [1.4.3](https://github.com/M-Facey/formjam/compare/v1.4.2...v1.4.3) (2023-12-04)


### Miscellaneous

* made format & e2e action run sequentially ([092325e](https://github.com/M-Facey/formjam/commit/092325e01441d629b06f3aec694229f35b99cdcc))

## [1.4.2](https://github.com/M-Facey/formjam/compare/v1.4.1...v1.4.2) (2023-12-04)


### Bug Fixes

* added form question debouncing ([79c10b4](https://github.com/M-Facey/formjam/commit/79c10b4f617fb83c424b467683260349747d4afe))


### Miscellaneous

* **main:** formatted codebase ([1498600](https://github.com/M-Facey/formjam/commit/149860044fc1d63263034bb21a3c9738060e0687))

## [1.4.1](https://github.com/M-Facey/formjam/compare/v1.4.0...v1.4.1) (2023-12-03)


### Documentation

* fixed changelog ([b80c298](https://github.com/M-Facey/formjam/commit/b80c29846ea579a20a45a86f9afa6cf04fa41362))

## [1.4.0](https://github.com/M-Facey/formjam/compare/v1.3.0...v1.4.0) (2023-12-03)


### Features

* added commitlint & husky hooks ([b00b1a4](https://github.com/M-Facey/formjam/commit/b00b1a4623b550441021701efc648c81f080f0df))
* added icons for text types & link to success page ([2fbcda0](https://github.com/M-Facey/formjam/commit/2fbcda02e10e1266a1c7cf5d5ff4a9fb2497adec))
* added share dialog to question controls ([787bff4](https://github.com/M-Facey/formjam/commit/787bff4372aacad9efd01155663a3387de879c97))


### Bug Fixes

* applied inter font to body only ([086096a](https://github.com/M-Facey/formjam/commit/086096afb3a617e4fa85c8b062ef39a1489510bf))


### Miscellaneous

* **main**: release 1.4.0 ([cc4511a](https://github.com/M-Facey/formjam/commit/cc4511ac52a3bf00995c10c1ca65a6bdd9a18423))
* added action to format codebase ([5a5789c](https://github.com/M-Facey/formjam/commit/5a5789c1b00c49a72539f706cddea98d7459184f))
* added link to preview/view form page ([bf6611c](https://github.com/M-Facey/formjam/commit/bf6611c0b77f480b04dcd34bc6e9373c4f0faec2))
* added rokkitt font ([d517bdc](https://github.com/M-Facey/formjam/commit/d517bdc0c4877e90f480ce6f1829053269005d6f))
* added share icon ([6e1e51b](https://github.com/M-Facey/formjam/commit/6e1e51b4b8d419fa860122a92a96f1f04d3c2ef4))
* formatted textarea autosize utility ([3a6df1d](https://github.com/M-Facey/formjam/commit/3a6df1d1657777175e1b0d5374157551b5a32648))

## [1.3.0](https://github.com/M-Facey/formjam/compare/v1.2.0...v1.3.0) (2023-12-01)


### Features

* added clear form feature ([cd49da1](https://github.com/M-Facey/formjam/commit/cd49da1da74d456b3662df4800609b7916455b66))
* added success route ([b1c9c14](https://github.com/M-Facey/formjam/commit/b1c9c14f2751c222399b961ef0599a6e73e4ff21))
* create form success page & added minor changes ([f89c5f9](https://github.com/M-Facey/formjam/commit/f89c5f97dac3ed07abce738aab68ec30532fe5c2))


### Bug Fixes

* added documentation section to release action ([e190f88](https://github.com/M-Facey/formjam/commit/e190f88a0919ead2ff9ae25b4e8692f74fa15b59))
* removed unnecessary padding ([9c44d6c](https://github.com/M-Facey/formjam/commit/9c44d6c47ceb2dc2be20420c41ccf417906025b1))
* stubbed all record request on dashboard test ([2900feb](https://github.com/M-Facey/formjam/commit/2900febdc18b7b9ad4072eb51174eae0bba50406))
* updated verbiage on delete toast ([16d14fb](https://github.com/M-Facey/formjam/commit/16d14fba21dd68dfc48f6475ced96cd01bb06a7e))


### Miscellaneous

* **main**: release 1.3.0 ([2331c1b](https://github.com/M-Facey/formjam/commit/2331c1b2c2a1addd194e6751d5b7571b178ac469))
* added breakpoints for tablet ([fb00875](https://github.com/M-Facey/formjam/commit/fb00875635969eb9e3442b1f17f94f9dfeb8b207))
* added share link icon ([d91cebb](https://github.com/M-Facey/formjam/commit/d91cebbe671d45310cabb37d2f055b57b461214f))
* added success icon ([3e92981](https://github.com/M-Facey/formjam/commit/3e929811a30c7f5b68ff602305b1417564311ed6))
* made create form component responsive ([dc0ac74](https://github.com/M-Facey/formjam/commit/dc0ac74a9545df6af2926dba5b22babfde120849))
* updated the mobile UI for form card ([405ad13](https://github.com/M-Facey/formjam/commit/405ad1372afeee3d5b1f39cbedd01bb6627919a9))


### Documentation

* added view & success routes ([dbe0fcf](https://github.com/M-Facey/formjam/commit/dbe0fcf76a3cd11ba5400f1b68e99544c7079d74))
* corrected PasswordReset name ([7b571a8](https://github.com/M-Facey/formjam/commit/7b571a8a84166a5f3dc6e9d9ecfb3ce7c721b526))
* updated router readme ([e59cf14](https://github.com/M-Facey/formjam/commit/e59cf141b42cb3d5a75ceddff9dbec7e87427476))

## [1.2.0](https://github.com/M-Facey/formjam/compare/v1.1.0...v1.2.0) (2023-12-01)


### Features

* created breakpoints utility ([34c9354](https://github.com/M-Facey/formjam/commit/34c93542a9274384aaf6fd52499c961034547859))


### Bug Fixes

* added log out functionality to mobile nav bar ([a2ddb12](https://github.com/M-Facey/formjam/commit/a2ddb1248232c79a4e00f8ce8d907bbaa7e23ac6))
* made filter on dashboard responsive ([7a5c11a](https://github.com/M-Facey/formjam/commit/7a5c11afd52a7305b66948c77653411fbf010de6))


### Miscellaneous

* **main**: release 1.2.0 ([3e8a921](https://github.com/M-Facey/formjam/commit/3e8a9212b2086d1efd693801c934d7d4168d759a))
* replaced menu with primevue menu ([5f34ce0](https://github.com/M-Facey/formjam/commit/5f34ce0a7923ee4399a6843e8710f7a7052e302e))

## [1.1.0](https://github.com/M-Facey/formjam/compare/v1.0.0...v1.1.0) (2023-12-01)


### Features

* added delete form dialog and tost ([d159444](https://github.com/M-Facey/formjam/commit/d159444ce4f45aaebab20d1ef1bf11f3bbe578eb))
* added link to preview form page ([1a53abf](https://github.com/M-Facey/formjam/commit/1a53abf4132561d77f575c26dbbe8f9a43fd6bb7))
* added primevue dependency ([f9f81dd](https://github.com/M-Facey/formjam/commit/f9f81dd895e9ac02b5dfbf2885f2173bcdc2f445))
* added primevue theme styles ([7e9233c](https://github.com/M-Facey/formjam/commit/7e9233cb9871fb602ebd5dd3761f2c9d8249f6c9))
* added tooltip to question controls ([042d262](https://github.com/M-Facey/formjam/commit/042d262a595380a5a6c3838cb81895ada5258c5c))
* create view form page & route ([7593166](https://github.com/M-Facey/formjam/commit/7593166571641d459ccddd0b1e6fee76d64f5c1e))
* created texteare autosize utility ([1013741](https://github.com/M-Facey/formjam/commit/1013741458bbbd406750739ea715f755052ada69))
* moved stylesheet import to html file ([b71c232](https://github.com/M-Facey/formjam/commit/b71c23233519c414b1ab3199a058e5dbe9ca228f))
* replaced checkboxes & radio btns with primevue components ([3a8a85b](https://github.com/M-Facey/formjam/commit/3a8a85b82b0970647cf94337c1e4b89e4679d7f5))


### Miscellaneous

* **main**: release 1.1.0 ([0e5b4f2](https://github.com/M-Facey/formjam/commit/0e5b4f2b8f58fc9e69efdc2d16ceeebecf1a71c4))
* added asterisk for required questions ([0f9288e](https://github.com/M-Facey/formjam/commit/0f9288e25aecc91fa25abd20af35360730c3e69a))
* added id to label ([75a4994](https://github.com/M-Facey/formjam/commit/75a4994172a05b4b0bc519a8e6b5773e89b4993f))
* added message to view page ([4fe2af5](https://github.com/M-Facey/formjam/commit/4fe2af51dd9c7bf3549fa8e6a20d31ee221b4f53))
* removed console log ([bf0a5d1](https://github.com/M-Facey/formjam/commit/bf0a5d1be6c2777c18de945a07ef5b4ea6f3cc53))
* renamed CreateFormCard component & added UI for form list ([585ce0d](https://github.com/M-Facey/formjam/commit/585ce0dd9b5aeb6cec3f903331fa36ac22e037b8))
* renamed router-link to RouterLink ([f15e80e](https://github.com/M-Facey/formjam/commit/f15e80e015eca288eaa71fc69bb97360205bac86))
* updated changelog format in release action ([f969da5](https://github.com/M-Facey/formjam/commit/f969da57f1acc057428ed0ddada8455573a794ea))
* updated create form import & added view prop ([65d2d7b](https://github.com/M-Facey/formjam/commit/65d2d7ba2209b287fe9e0ff83f022fa609bf4cd2))

## 1.0.0 (2023-11-29)


### Features

* add webp images to home page ([417f9dc](https://github.com/M-Facey/formjam/commit/417f9dc5fb1777acee0ace8908feaf9116e9b55f))
* added @faker-js/faker deps ([2c91778](https://github.com/M-Facey/formjam/commit/2c917788970194938affeadfe94153e9aacc7dd8))
* added @tauri-apps/cli deps ([02e3e95](https://github.com/M-Facey/formjam/commit/02e3e955ace4c0566790cd29758686125d69dac3))
* added @types/node dep ([83062f8](https://github.com/M-Facey/formjam/commit/83062f86085275f359e0f057117a1919e84d5310))
* added @vueuse/core ([bd003d9](https://github.com/M-Facey/formjam/commit/bd003d9663ab6756b6530810c83a5c1540b5c510))
* added LICENSE file ([12fefef](https://github.com/M-Facey/formjam/commit/12fefef7aa005810678f4a4df499c28d02688d35))
* added OG image ([41ea75a](https://github.com/M-Facey/formjam/commit/41ea75ad81cde759b1674d5efded169c126f8be5))
* added PWA assets to public ([05dd503](https://github.com/M-Facey/formjam/commit/05dd503d3985e357745d17dd5ba17004b9623d8a))
* added action for cypress tests ([87cba3b](https://github.com/M-Facey/formjam/commit/87cba3b9cb9a4bfff054b506a1bac835deef295d))
* added alert and close icons ([c9c299f](https://github.com/M-Facey/formjam/commit/c9c299f341a0831a28a8a2a98d219b173d4d4890))
* added alert icon ([066962b](https://github.com/M-Facey/formjam/commit/066962b2492ded8d837df7877c635e87c534660d))
* added answer component ([a059de3](https://github.com/M-Facey/formjam/commit/a059de37e1c5b6ef98f3d82d9b8d6a50227c1433))
* added answer to form question ([8b95224](https://github.com/M-Facey/formjam/commit/8b95224a1777b7cacc5dd9262419475a5ec6dc18))
* added arrow icon for dropdown ([103eed3](https://github.com/M-Facey/formjam/commit/103eed3d81f7a9ad89e920258bd9a74dafbc81c1))
* added auth commands to cypress ([c41f1c9](https://github.com/M-Facey/formjam/commit/c41f1c9fe14fede59c5fc22d260f1dfedbacf44e))
* added auth middleware to router ([d632614](https://github.com/M-Facey/formjam/commit/d6326148f6f09a5ea12775a857028ab9fab63388))
* added authRequired to form routes ([fce42b6](https://github.com/M-Facey/formjam/commit/fce42b6d788d87f82b4740cf71dadb87ad9c7a2d))
* added basic login functionality ([85d0d4b](https://github.com/M-Facey/formjam/commit/85d0d4bd66224fbba12ac786dc4482ea63afa214))
* added basic notification functionality ([24861fb](https://github.com/M-Facey/formjam/commit/24861fbd3a5ff75db03032f979bb0e7b71fecad8))
* added basic sign up functionality ([df6852f](https://github.com/M-Facey/formjam/commit/df6852f4d1ca2fc9583e4ca1ba0431b16428161e))
* added box shadow to icon on info card ([496c19c](https://github.com/M-Facey/formjam/commit/496c19cfc1471fd1c252887d9737a90bca34f596))
* added character count plugin for tiptap ([b163cdd](https://github.com/M-Facey/formjam/commit/b163cdd23aacf2ab5cf7b6b0c39fac0886c88192))
* added chart, clipboard & phone emoji icons ([0f57416](https://github.com/M-Facey/formjam/commit/0f5741614b0914fef569b8ef6693e0ab42ecdc5f))
* added check icon ([d9faa13](https://github.com/M-Facey/formjam/commit/d9faa1396bdc6967fa6e98e808c09810b25b40c9))
* added colors to tailwindcss ([28738bc](https://github.com/M-Facey/formjam/commit/28738bc0126efde588f9edc03925100ce80e654f))
* added commands for testing password inputs ([950f6ba](https://github.com/M-Facey/formjam/commit/950f6baae5071dbae5e85ef1cb19ff9a2e321784))
* added confirm password page ([f2b887d](https://github.com/M-Facey/formjam/commit/f2b887dc08e31b261fd7c5ca3923419229c1725b))
* added confirm password page to router ([2b38256](https://github.com/M-Facey/formjam/commit/2b38256f4bc0186392a793061e407e85ce58255e))
* added control functions to question component ([fc4fb54](https://github.com/M-Facey/formjam/commit/fc4fb543f7b7218f744e33b0056c60eaa5787d39))
* added copy & delete icons ([5605045](https://github.com/M-Facey/formjam/commit/5605045ffdef9ead243b249a53f239aa1029e50b))
* added create form card ([e83f1d7](https://github.com/M-Facey/formjam/commit/e83f1d7ad0dde932bc310afad2a62547b5c43a9b))
* added create form card to form grid ([447088a](https://github.com/M-Facey/formjam/commit/447088abc7d8ffca4b5f8ada43e06e67918aa2c8))
* added create form page ([35ea4c8](https://github.com/M-Facey/formjam/commit/35ea4c84f081efaca6dc98fc533e9142f6eeebc8))
* added create form page to router ([a8d9b14](https://github.com/M-Facey/formjam/commit/a8d9b14b2f90a82f04675f6443a0a390df8de34b))
* added create form util function ([555e3c2](https://github.com/M-Facey/formjam/commit/555e3c295a9925923d29067556ce9896f3d11e6d))
* added cypress and dotenv deps ([cdb23e4](https://github.com/M-Facey/formjam/commit/cdb23e48a21ee0a5255c1540d3f658579622f3c0))
* added cypress tests for dashboard ([335957a](https://github.com/M-Facey/formjam/commit/335957ad9f72fbc3f07c3f1ac297e33b4b5839f5))
* added dashboard to router ([f88d655](https://github.com/M-Facey/formjam/commit/f88d655cb3391168852018da775ae7e52de31977))
* added dayjs to app ([90a0365](https://github.com/M-Facey/formjam/commit/90a036582d9b17ed09c69d1c2438b87feeda41ea))
* added dropdown for form card ([ffcdee2](https://github.com/M-Facey/formjam/commit/ffcdee2840a76b60b0692ec78c0160486c46518f))
* added editor config ([ac52bac](https://github.com/M-Facey/formjam/commit/ac52bacd02641b20dd44a322c9caa02aab6e2e11))
* added envs and configs for cypress ([0c7e7a4](https://github.com/M-Facey/formjam/commit/0c7e7a4e684f24523d72365882b00031305e9923))
* added epilogue font to app ([fe135e6](https://github.com/M-Facey/formjam/commit/fe135e610f3ec13abd5397f89209a30d08ad74ce))
* added eye icons to text input ([a5fa7a3](https://github.com/M-Facey/formjam/commit/a5fa7a340449b123016e3901fdc9d4942c987dd5))
* added facebook & twitter meta tags ([9897100](https://github.com/M-Facey/formjam/commit/9897100aba6b9ca72172f64ba679f340d53315f1))
* added filter tab to dashboard page ([512450b](https://github.com/M-Facey/formjam/commit/512450b0d36149837abc41ff0a31c6f90d4e27bd))
* added form card component ([04b7366](https://github.com/M-Facey/formjam/commit/04b73660500ff882971487b9d64c0c5eb9bf5cd5))
* added form card grid component ([b46a8cf](https://github.com/M-Facey/formjam/commit/b46a8cfd0c627d5b3cfb5e6b77130eb2ba4e3d43))
* added form card grid to dashboard ([e6b8ade](https://github.com/M-Facey/formjam/commit/e6b8ade7837f25da568d6646d43e8ef3e0779fb1))
* added form card loader ([cb0b54f](https://github.com/M-Facey/formjam/commit/cb0b54fbd64f5ae031558635b3c285c4a65ebef0))
* added form card loader to form grid ([4e9ef76](https://github.com/M-Facey/formjam/commit/4e9ef761322cfa69573d379cccac1b73c1515596))
* added form error message component ([219906f](https://github.com/M-Facey/formjam/commit/219906fb9ec4c6ab6fb089e9f85c0a58e046219e))
* added form icon ([0223040](https://github.com/M-Facey/formjam/commit/0223040654a7baf44940a083be9e298a33e51436))
* added form item prop types ([cd8e9d4](https://github.com/M-Facey/formjam/commit/cd8e9d466c87c2fe725ea38112f0e46e786bd2f4))
* added form layout & fixed layout names ([c25d1dd](https://github.com/M-Facey/formjam/commit/c25d1dd06ba71c92f2c2c833b9d7da9ee322e1b0))
* added form list to dashboard ([3558530](https://github.com/M-Facey/formjam/commit/355853058938259bd7ac5d0e8b81abc58d40095b))
* added form question component ([3bb23cf](https://github.com/M-Facey/formjam/commit/3bb23cf98bdba72a7a4ce8ff3dfdb793260da390))
* added form question list component ([5d800b3](https://github.com/M-Facey/formjam/commit/5d800b33a54bce0adc4f3a9502b60c15d04fef40))
* added form types ([6e4af41](https://github.com/M-Facey/formjam/commit/6e4af41fbb30d025c792605a3ae2372389ba2bae))
* added forms props to FormCardGrid ([3f75de5](https://github.com/M-Facey/formjam/commit/3f75de5bd4792a36f85e596bf9f6f8bda1a2b913))
* added hand heart icon ([011efd2](https://github.com/M-Facey/formjam/commit/011efd26603e3b8e20133497da6af40e0a838468))
* added havbar for home page ([c038876](https://github.com/M-Facey/formjam/commit/c0388763acde499b30bef3c14200493b06842bae))
* added icons for filter tab ([f2e4eb2](https://github.com/M-Facey/formjam/commit/f2e4eb21bc544ff488e6d6c5c048dc15043cfa07))
* added icons for form card ([c6acacd](https://github.com/M-Facey/formjam/commit/c6acacdc620a4c071bac371cee99dde8c3b3bd15))
* added icons for navbar ([5ceea8f](https://github.com/M-Facey/formjam/commit/5ceea8fbb08d676ae62c030628f73d1e886395a0))
* added icons for question types ([c847ce6](https://github.com/M-Facey/formjam/commit/c847ce69a83da908d018fc33ee07ead85569beb5))
* added icons for text formatting ([5c5f72e](https://github.com/M-Facey/formjam/commit/5c5f72e35fad4a7698fc7636a20b993d43967caf))
* added icons for theme ([2cbe339](https://github.com/M-Facey/formjam/commit/2cbe33981c82fc61ce5473948dccea982de6da2c))
* added images for home page ([05e2371](https://github.com/M-Facey/formjam/commit/05e237132c8410a362c9c4bd8c089e59eec9500b))
* added info card component ([10f6d5b](https://github.com/M-Facey/formjam/commit/10f6d5b0c1e237ead52fb9c177f768d0302b8642))
* added inter font ([51104e8](https://github.com/M-Facey/formjam/commit/51104e8d1c91c23ba55b8c19a77ba8717b895748))
* added isLoading to form grid layout ([602db5b](https://github.com/M-Facey/formjam/commit/602db5bc30454ab09a81b2044b61fc2ab91a839a))
* added layout for form pages ([5009dbe](https://github.com/M-Facey/formjam/commit/5009dbee12b94f7d8618b54e816b5c249fc60277))
* added layout to app ([5625945](https://github.com/M-Facey/formjam/commit/56259459da666bee877e49fbc416b572baf36c45))
* added layout toggle ([9eda3f7](https://github.com/M-Facey/formjam/commit/9eda3f7f718995c02c25a8031eecbf35dfb5407c))
* added light theme images for home page ([986d99b](https://github.com/M-Facey/formjam/commit/986d99ba5c1a7eaf394715cf0bcc6b8953505c35))
* added linear scale icon ([5414ae8](https://github.com/M-Facey/formjam/commit/5414ae8bad02be390ca4f45a0cdb61bce07a22f9))
* added list functionality to editor input ([ab039ad](https://github.com/M-Facey/formjam/commit/ab039adbaaa0a556b305fb56513d20a2bff3bf50))
* added log out functionality ([a14d26c](https://github.com/M-Facey/formjam/commit/a14d26c66f1e376a9e28a492939718a8071c3499))
* added login and sign up page ([afd6b52](https://github.com/M-Facey/formjam/commit/afd6b52fae398ff6bfa0aa7c042fbf2f0c2c57be))
* added manifest file ([f7d0e88](https://github.com/M-Facey/formjam/commit/f7d0e88b14641f33034d85adeeaf5def9d8a8896))
* added menu icon and new props to dropdown ([f6ef7c1](https://github.com/M-Facey/formjam/commit/f6ef7c1c212f7d277a649be33e18a7a478087a77))
* added min and max length to text input ([cc11bc3](https://github.com/M-Facey/formjam/commit/cc11bc3563c2e981fa5e04a7238972ffc6bed372))
* added mobile nav bar ([a71a71c](https://github.com/M-Facey/formjam/commit/a71a71cd44a574f2ad5d301e35e9ccf4846b360c))
* added mobile navbar component ([abbbe2f](https://github.com/M-Facey/formjam/commit/abbbe2f36acc3c852849d24cea13c2f48544b1eb))
* added more auth related tests ([d8898f5](https://github.com/M-Facey/formjam/commit/d8898f525ce64adceb5c416fd5d40a49ded8b8d6))
* added more form types ([551fba6](https://github.com/M-Facey/formjam/commit/551fba6d30ca2b3b2d08a796887eb424a7bed9d9))
* added multiple layouts ([d0caf38](https://github.com/M-Facey/formjam/commit/d0caf383401a9d87e058f3842765027f1c399e8b))
* added nanoid ([157969a](https://github.com/M-Facey/formjam/commit/157969a3d27adb37f84d14188e35c99f72117c3c))
* added nav link to create form button ([0f03d28](https://github.com/M-Facey/formjam/commit/0f03d2895b893887d97dc5966d404e6e4f83e62c))
* added navbar for creating a form ([70d1f6b](https://github.com/M-Facey/formjam/commit/70d1f6b59efcc3b49784a5f2209d27e62d74a8c6))
* added page break icon ([6fd9b38](https://github.com/M-Facey/formjam/commit/6fd9b382eec3f7f6fb8177561dfec850a3d5cc9e))
* added pages to router ([e51c15d](https://github.com/M-Facey/formjam/commit/e51c15d77e6da14d522d429c37878c449f315894))
* added password reset page ([b8a3ee8](https://github.com/M-Facey/formjam/commit/b8a3ee814143bb6a8d932fb1c366a3a5a30fd2ad))
* added paste feature, character count & limits ([aafa08f](https://github.com/M-Facey/formjam/commit/aafa08fce7f83095abe54759003f34047bc18432))
* added pinia to app ([dd58602](https://github.com/M-Facey/formjam/commit/dd58602621de1138c36453d6759ef24a290d4c56))
* added plus & user icons ([e03352d](https://github.com/M-Facey/formjam/commit/e03352d929baaa7ea49a17a98af133bf25900129))
* added pocketbase to app ([23aed89](https://github.com/M-Facey/formjam/commit/23aed895e1873d5cced381062a5afb5daede5bce))
* added question controls & handled emitted functions ([31a3836](https://github.com/M-Facey/formjam/commit/31a3836dd2e048e0025baade3c0464f9a6db4f28))
* added question controls component ([350b9ca](https://github.com/M-Facey/formjam/commit/350b9cace592c09544db0f2ea667f85bcacd8747))
* added redirect and removed unused routes ([4613281](https://github.com/M-Facey/formjam/commit/4613281eb900c0b4fb0889e9032796192680d46a))
* added redirect to home tests ([97a799f](https://github.com/M-Facey/formjam/commit/97a799f2d8d9b9e9a1755a2c0b3aaacbdf163beb))
* added rich text editor input ([dabdbec](https://github.com/M-Facey/formjam/commit/dabdbecfa3655d02082af4e0751c1f789d3852af))
* added robots file ([0d5e545](https://github.com/M-Facey/formjam/commit/0d5e54512508e4aa31f36e8d9b3a1acbf05ccdca))
* added search icon to text input ([9159cb4](https://github.com/M-Facey/formjam/commit/9159cb44cd0572a01ecdff1c62408b0c53b04930))
* added settings icons ([0eefa5a](https://github.com/M-Facey/formjam/commit/0eefa5a24affc69ccf2e78a94ec062fcccddcca4))
* added sign up tests ([040d595](https://github.com/M-Facey/formjam/commit/040d59528c542c178298ce6eef680a03bb69b9a9))
* added styles for custom buttons ([e6dfa3b](https://github.com/M-Facey/formjam/commit/e6dfa3b118dbec336da0474321610608a6002f08))
* added success message & redirect to login ([0cec98c](https://github.com/M-Facey/formjam/commit/0cec98cdf058864ad28b4c2d382dc8fc2a01af0a))
* added svg loader ([8de1adb](https://github.com/M-Facey/formjam/commit/8de1adb881fed1d8205e0eb93e9a1d5d72e549e9))
* added tailwind typography plugin ([9b65e62](https://github.com/M-Facey/formjam/commit/9b65e62569768069ef6e00fbe21d6b3a3bae11d9))
* added tailwindcss ([147db35](https://github.com/M-Facey/formjam/commit/147db356f9d035e59933093b4b0adc291013af11))
* added task for generating new user info ([701f820](https://github.com/M-Facey/formjam/commit/701f8200b017304baf9fea7262a3574e501ce8a5))
* added tauri ([efc2816](https://github.com/M-Facey/formjam/commit/efc28163cbc58f67e6fad697c616ce03856507a3))
* added tests for forgot password flow ([68cedb4](https://github.com/M-Facey/formjam/commit/68cedb4c40abd5458bf106b32bb406f9dfc213de))
* added theme classes to checkbox component ([4850497](https://github.com/M-Facey/formjam/commit/4850497d75dbfe573f5719acb8d647983a986a92))
* added theme store to app ([c3b240f](https://github.com/M-Facey/formjam/commit/c3b240f64aad46e8b97ad11f1d73cc6e73685724))
* added theme toggle ([5b75905](https://github.com/M-Facey/formjam/commit/5b7590500ff779a6a6c4e8cc1402352f5f838c29))
* added theme toggle and footer to auth layout ([2190d3b](https://github.com/M-Facey/formjam/commit/2190d3be4bd7a523042ca17197f9aaf326c21747))
* added tiptap rich editor ([16b5022](https://github.com/M-Facey/formjam/commit/16b50221e5a0f59e3607baae29a7e19057a0a9fd))
* added title card component ([831531e](https://github.com/M-Facey/formjam/commit/831531edb92ed4538cb4f59b2fad7dfff237e048))
* added title card to question list ([cb7aae4](https://github.com/M-Facey/formjam/commit/cb7aae4927e1bf9958c93c7c8c93e0f4be341873))
* added toggle component ([6d62b21](https://github.com/M-Facey/formjam/commit/6d62b2136fc98d6e84d57e8a9a145dbd984ad98e))
* added toggle type ([77d8fff](https://github.com/M-Facey/formjam/commit/77d8fff7f68a4e8294ef88021ad5d559a1311232))
* added tooltip component and type def ([c809685](https://github.com/M-Facey/formjam/commit/c809685d189382918011628aedda26c0b0f6f112))
* added two-way binding to dropdown ([9d805cf](https://github.com/M-Facey/formjam/commit/9d805cf8ae9a780a10bcc094a1f10b45ca88ecf1))
* added validadtions for login and signup form ([7c8dfee](https://github.com/M-Facey/formjam/commit/7c8dfeef1f671b9f4e7cc51aeda1d6eeaedf0452))
* added validated text input component ([63dcb98](https://github.com/M-Facey/formjam/commit/63dcb9805934dd2b89b1b8cdb8ef15f0b86bc498))
* added validations to text input component ([cdda5e3](https://github.com/M-Facey/formjam/commit/cdda5e3741be28f1fdabb23d32ab168e0b2c9f33))
* added vee-validate & yup for form validation ([d053654](https://github.com/M-Facey/formjam/commit/d053654721033f7bb6d5ea45930a2b556a4af3bb))
* added vue-router ([29dc628](https://github.com/M-Facey/formjam/commit/29dc628cb20139111dd6c8826ef44ae921bf2873))
* added xs breakingpoint ([39f5e9f](https://github.com/M-Facey/formjam/commit/39f5e9f8ea7ec7ec28019eb1713f8010cb766ef2))
* check system theme on app launch ([039622a](https://github.com/M-Facey/formjam/commit/039622aac8c6c1dcd1618b96d246081aa2253a5d))
* created app layout ([ebcb76c](https://github.com/M-Facey/formjam/commit/ebcb76c9b7042b25f58033f5234c3a093bea6576))
* created basic input components and type defs ([7cc92be](https://github.com/M-Facey/formjam/commit/7cc92be7f99ca411d603f96673b06e63c99e91a5))
* created dropdown component & type def ([aeb6bf0](https://github.com/M-Facey/formjam/commit/aeb6bf089affc78165b14acc6921b916b66663af))
* created eye open & close icons ([a97b031](https://github.com/M-Facey/formjam/commit/a97b0318f22927814ddf65dda465bbdd6e8f0a2b))
* created filter tab component ([c81fb07](https://github.com/M-Facey/formjam/commit/c81fb07b5c65fcc32ebf2b94850edeeee4c576cd))
* created form item component ([9c08f3d](https://github.com/M-Facey/formjam/commit/9c08f3d4cc0e54da6cc1344bb91eb5be528add0a))
* created form list & added form items ([ba317e6](https://github.com/M-Facey/formjam/commit/ba317e65854cd76a0d3d3532258dbe9491f4cc70))
* created form store ([40b9d28](https://github.com/M-Facey/formjam/commit/40b9d28e35fdfd1cb1d9ad02f62ae0fcbecf3f79))
* created navbar component ([ea55b07](https://github.com/M-Facey/formjam/commit/ea55b07e51f796919eb643cad0034ed163fc72ce))
* created question store ([98545ac](https://github.com/M-Facey/formjam/commit/98545ac206b90598d506e9ed837095c6aaa21098))
* created release-please action ([deaf27e](https://github.com/M-Facey/formjam/commit/deaf27ed370c56124dd8c17a698652d710966334))
* fetched form data form pocketbase ([4727705](https://github.com/M-Facey/formjam/commit/472770536eaea35f908c90650298c4552b1c3b52))
* fetched question data from pocketbase ([dcaa359](https://github.com/M-Facey/formjam/commit/dcaa359e5f3a033aee6f810f93ffc2718e0166a6))
* initial commit ([831fa47](https://github.com/M-Facey/formjam/commit/831fa47ca71f5e9eab0e24ec18e7a4980f5488e9))
* made confirm password page responsive ([155463d](https://github.com/M-Facey/formjam/commit/155463d9fd35ce780f0442e0bfb07f83f494d2eb))
* made password reset page responsive ([1c5acd9](https://github.com/M-Facey/formjam/commit/1c5acd93fb15f2d1b4c097fe8889dffdee21a02e))
* moved font imports into head element ([15c7256](https://github.com/M-Facey/formjam/commit/15c725655df6200dafd668eef6371922cb32bf16))
* refactored login command ([697972f](https://github.com/M-Facey/formjam/commit/697972f19cadaf4e08f8afe250848543158a1d60))
* replaced text input component & updated signupUI ([f6326a4](https://github.com/M-Facey/formjam/commit/f6326a44ae03384a5fee6e0434e4f264bcb6d33a))
* run cypress tests on cypress dashboard ([62b345c](https://github.com/M-Facey/formjam/commit/62b345cb8d709b7af0c28382d0332a607b11f892))
* show icon for dropdown options ([8ffe9ab](https://github.com/M-Facey/formjam/commit/8ffe9ab63e7cf1b05d92554c46e85f5044650bd4))
* started adding light theme colors ([052fd9f](https://github.com/M-Facey/formjam/commit/052fd9f6625303d01b6896b8c69fdc0834ef58a6))
* updated editor styles based on input type ([c214860](https://github.com/M-Facey/formjam/commit/c2148603089091afebc86845120b1211f1d30a7a))
* updated home page info and styles ([b18f8a0](https://github.com/M-Facey/formjam/commit/b18f8a0e854dd21d67d36bc0addc72bdc3f1181c))
* updated login page UI ([a61590c](https://github.com/M-Facey/formjam/commit/a61590ce85f1774201aaf326f94f9bf576ab910f))
* updated logo in navbars ([3040b07](https://github.com/M-Facey/formjam/commit/3040b07abcea6c2c834390d26a3e8682ccbf0517))
* updated question on pocketbase ([a0d20ae](https://github.com/M-Facey/formjam/commit/a0d20ae94d0c85ef02c9c27f7c5dc3f752231eb9))
* updated theme for home page ([f59d187](https://github.com/M-Facey/formjam/commit/f59d1876fa86965941924abe64b1fdfa39dab05b))
* used answer component for dropdown option ([d59e7ee](https://github.com/M-Facey/formjam/commit/d59e7ee5d11d363ef06f4c434968116082d25e68))
* used unformatted title & added responsive styles ([39be928](https://github.com/M-Facey/formjam/commit/39be928b972b09c993f2e8a39c2be5bc1540dc39))


### Bug Fixes

* added data-cy to validated text input ([bd1395d](https://github.com/M-Facey/formjam/commit/bd1395d477bcb5c61d9c293db4637c32fc3fe562))
* added required and autocomplete prop to validated text input ([13cbbdd](https://github.com/M-Facey/formjam/commit/13cbbddf13abcd27f1616943543cb8e0551d956c))
* allow text wrapping for long words ([2d4037b](https://github.com/M-Facey/formjam/commit/2d4037bf49ba8f554db9cf133bbd97bea0d0273b))
* allowed form card dropdown to overflow ([97014ba](https://github.com/M-Facey/formjam/commit/97014ba6aeccaa9000393005e41296eb9a2a945f))
* changed dayjs to use default import ([22c5e2f](https://github.com/M-Facey/formjam/commit/22c5e2ff72f4c4296a393e79e03bc43f4ad22717))
* changed from h-full to dvh ([286d61c](https://github.com/M-Facey/formjam/commit/286d61c870414a1687ff8a7c269ea45d5c7b5a72))
* changed svg attrs from camel to snake case ([3ccecf4](https://github.com/M-Facey/formjam/commit/3ccecf40a907178efa83719c13a73be5c8a88802))
* color contrast on create form card component ([89fcefb](https://github.com/M-Facey/formjam/commit/89fcefb151e94cd03ad535b2881ba181e5bee206))
* corrected event name ([1c84649](https://github.com/M-Facey/formjam/commit/1c8464927c4304a7d4fc77a46d9d18d6a7b7740b))
* corrected facebook & twitter description ([715b259](https://github.com/M-Facey/formjam/commit/715b259749f7b0532a49cd23790798db9847047a))
* corrected hand heart import ([6df2313](https://github.com/M-Facey/formjam/commit/6df23133cab96c2021fa07b5689711476ff8c3d8))
* corrected icons imports ([d2895e5](https://github.com/M-Facey/formjam/commit/d2895e56d7881aeb5e9c54ca68a69e534b816eff))
* corrected test names ([7f88f2a](https://github.com/M-Facey/formjam/commit/7f88f2a4611e1863a382e369ade35fd7012d4e20))
* fixed button size ([c52696d](https://github.com/M-Facey/formjam/commit/c52696dd63ab63b9802c6c912af9283776a91435))
* fixed home navbar dropdown ([78ccdb3](https://github.com/M-Facey/formjam/commit/78ccdb309e047730a7d22ac35d4653e92951e142))
* fixed navigation on vercel ([9575d68](https://github.com/M-Facey/formjam/commit/9575d68b137e59ef5d6084a76d6f64d6c12dc268))
* hid text if none is present ([8564ec1](https://github.com/M-Facey/formjam/commit/8564ec1596e3c73e41d5876294bdaade2dc41912))
* installed pnpm separately ([6490a15](https://github.com/M-Facey/formjam/commit/6490a15406ddd12182d6a5c37f9502f727c0e1e3))
* made linear gradient on info card consistent ([cac52be](https://github.com/M-Facey/formjam/commit/cac52be930a867bcde5e20d492b839b7e161279f))
* overwrite install-command with pnpm install ([7e52004](https://github.com/M-Facey/formjam/commit/7e520045c4e38d1818b568a5165e7e59beee4913))
* prevent enter from toggle show password ([d165b1d](https://github.com/M-Facey/formjam/commit/d165b1d7407976d907441a0d323782e81302f68d))
* prevented weird highlighting behaviors ([183fa5d](https://github.com/M-Facey/formjam/commit/183fa5db72c9c201543bc4e6ba8458cf726a7ac5))
* removed gap between navbar and dropdown menu ([e7627fd](https://github.com/M-Facey/formjam/commit/e7627fddf08b387106e272d8c0ef632e01244762))
* removed pnpm cache ([8e8e05f](https://github.com/M-Facey/formjam/commit/8e8e05fca0be882acc5fc4fec330fb99e716f74c))
* removed type def from pocketbase ([19a8c0e](https://github.com/M-Facey/formjam/commit/19a8c0ea567da2452002b9e96f3167a0faaa7f29))
* rendered title on form card correectly ([0402e14](https://github.com/M-Facey/formjam/commit/0402e1403c213c57aea5c17465b1a5b5220e5724))
* replaced facebook & twitter image url ([f19e05c](https://github.com/M-Facey/formjam/commit/f19e05c9dfa654809aa50c21406b93be7c758a35))
* replaced router-view to slot ([b9bbe07](https://github.com/M-Facey/formjam/commit/b9bbe07839017c627d02a7c593276c5f2c1005aa))
* showed error message & added close error messsage function ([81fa7fa](https://github.com/M-Facey/formjam/commit/81fa7faa992be8bfd084ab0b5f09ebdbd6cd3164))
* updated correct order function ([0bc19bc](https://github.com/M-Facey/formjam/commit/0bc19bc19212ae108510cae7d7865708b068127e))
* updated data used for creating questions ([dd8be27](https://github.com/M-Facey/formjam/commit/dd8be27d2dcbf5f6e9257d7022de48df65223f88))
* updated data used to create forms ([66cd075](https://github.com/M-Facey/formjam/commit/66cd07502d70719783a1df5f9398dc47995e28f1))
* updated different actions used in workflow ([dce8d07](https://github.com/M-Facey/formjam/commit/dce8d07306405f78b48dfe1f1e67e0cda0de6a81))
* updated editor menu & added aria-label to btns ([ad9af20](https://github.com/M-Facey/formjam/commit/ad9af200f18f0e6011fffd3a6c4f5b6389265c96))
* updated github secrets ([a0886b9](https://github.com/M-Facey/formjam/commit/a0886b96fdd95727f8f04d61f14f841145b9b732))
* updated the OG image and url ([d19b523](https://github.com/M-Facey/formjam/commit/d19b523e9cac085c3c99a0ebc9a9adbcf6eb0686))
* updated validation message for password ([a39afb8](https://github.com/M-Facey/formjam/commit/a39afb81b364bbc8f9e23c7982c13e8ce3e709d3))
* updated validation message for password on login ([be97b21](https://github.com/M-Facey/formjam/commit/be97b215c2b65d86154ebc298fb4a0f19e0d5de5))
* used bare minimum for cypress action ([5112fff](https://github.com/M-Facey/formjam/commit/5112fffa45e1f639472acad3b97e6cd9bd8eab79))
* used form element & added new props to text inputs ([d41b0fc](https://github.com/M-Facey/formjam/commit/d41b0fca8b4251a382394d1f84ce39b2dc160f0f))
* used form element & added new props to text inputs ([da4b45a](https://github.com/M-Facey/formjam/commit/da4b45a668b298ce9749f37839eda47783fbdce5))
* used pinia plugin correctly ([ab8265e](https://github.com/M-Facey/formjam/commit/ab8265e563415b52c4d0a4f5524af97e1041aa9a))


### Miscellaneous

* **main**: release 1.0.0 ([9c59902](https://github.com/M-Facey/formjam/commit/9c59902a521a880db05e9b3050067bac74eacb97))
* added UI tests in cypress ([b0d70bb](https://github.com/M-Facey/formjam/commit/b0d70bb3ede3f93d064b04c6a4a4f9faf5fedf33))
* added app description to html file ([aff8e85](https://github.com/M-Facey/formjam/commit/aff8e853b90ebd14ddc6fb986d9b00233d184e01))
* added aria-label to button on from card ([f84e16f](https://github.com/M-Facey/formjam/commit/f84e16f483a4cc8da88334ace9cedfd93499ca44))
* added aria-label to button on validated text input ([534ac59](https://github.com/M-Facey/formjam/commit/534ac598213d513274c1f68a3ff49c95ff467f59))
* added banner for readme ([c771e7c](https://github.com/M-Facey/formjam/commit/c771e7cf4999a0e5ffefde50a5ad511bf77837ca))
* added base input type ([151dc6d](https://github.com/M-Facey/formjam/commit/151dc6d8c57945a57839e92c03b7925afaccb0e0))
* added bindings to dropdown ([7a67cb6](https://github.com/M-Facey/formjam/commit/7a67cb6f55ba50dffa4ceb5c0a2f1659e6748788))
* added cypress data attrs to password reset ([321adf1](https://github.com/M-Facey/formjam/commit/321adf106e9df5b89e2031af107b1f08e22cc031))
* added data attrs for cypress tests ([a0ee652](https://github.com/M-Facey/formjam/commit/a0ee652e84515b00e25da42f89a789fbf8374a72))
* added data attrs for cypress tests ([fcb824c](https://github.com/M-Facey/formjam/commit/fcb824c0407468fb05ab0b571ac06cf08349bdcd))
* added data-cy to homepage link on login & signup ([365e9f4](https://github.com/M-Facey/formjam/commit/365e9f4f9f32cdb0908dceed16d94ea06c771950))
* added emit type for dropdown ([931bb9e](https://github.com/M-Facey/formjam/commit/931bb9e25dd509386c6e5eecd047ffad557759af))
* added envs for cypress ([bf8c581](https://github.com/M-Facey/formjam/commit/bf8c58183eca985ba972840b27b007e919ac1ab0))
* added example env file ([40f1c58](https://github.com/M-Facey/formjam/commit/40f1c581f9db5de3fb610476224058f6e59bd6ff))
* added icons for list functionality ([3afbf31](https://github.com/M-Facey/formjam/commit/3afbf311b6c99be0f0327140e2c3344e785d3414))
* added layout for auth routes ([12c693b](https://github.com/M-Facey/formjam/commit/12c693be18dc197abdd387c0d0098e10ab4bb974))
* added link to home on login & signup ([83ec5da](https://github.com/M-Facey/formjam/commit/83ec5da3f71b7b4903ed3c7881e27d0d9ca5d27a))
* added log in & dashboard link to home ([4a54e1e](https://github.com/M-Facey/formjam/commit/4a54e1e754c16bb9c8f117ceb7d45374c754bf89))
* added minor fixes ([749de25](https://github.com/M-Facey/formjam/commit/749de252dba4ae4c17b55984ab80d3125047d23f))
* added params for login command ([20a0175](https://github.com/M-Facey/formjam/commit/20a0175713997d59b6c83a8b2bb6299a5c731056))
* added pocketbase type def ([99b0098](https://github.com/M-Facey/formjam/commit/99b0098518d12dcc8c9bca72687909dc9d7d988f))
* added theme class to sign up heading ([d0a3163](https://github.com/M-Facey/formjam/commit/d0a3163520ff1c8be4ca6b31b394f520cc965a12))
* added theme classes for password icons ([663d2a5](https://github.com/M-Facey/formjam/commit/663d2a560836fd1e85858479db8d86aedc073a96))
* added type def for tasks with generics ([96adfe5](https://github.com/M-Facey/formjam/commit/96adfe5897a50025f588e26f6802052bb4451c0f))
* added type reference to ui cypress tests ([84e63ee](https://github.com/M-Facey/formjam/commit/84e63ee5273e763c23b8707df1dc932a336952ca))
* adjusted text size ([6030e23](https://github.com/M-Facey/formjam/commit/6030e232529d3490f7bc8146eb8dcab3fe98ed78))
* adjusted the padding on signup & login btns ([d0a5f71](https://github.com/M-Facey/formjam/commit/d0a5f71a2486461de27759296cc9b71297da50a1))
* changed editor type for form description ([f764487](https://github.com/M-Facey/formjam/commit/f76448775f22d0dec93e8e761bfd6272b8768b30))
* changed gradient for smaller screens ([dcbbd13](https://github.com/M-Facey/formjam/commit/dcbbd135c47b2671d7c2401666f657f2f06c240d))
* changed menu animation to use CSS ([427b33a](https://github.com/M-Facey/formjam/commit/427b33ae1c454fa600f55bd28ca54a9d89afe099))
* changed site title ([4e7c9c5](https://github.com/M-Facey/formjam/commit/4e7c9c5bae8f5710a9b28ddb33983fcc3bf36f65))
* changed to dynamic imports for router ([8f98aee](https://github.com/M-Facey/formjam/commit/8f98aee35e07fbb90a9132c7f9c0b0e7644dd37a))
* changed to h-full ([dfcdca8](https://github.com/M-Facey/formjam/commit/dfcdca8fdc8c4606290173e3922d14c9afaf184f))
* changed to password inputs ([f04a6e4](https://github.com/M-Facey/formjam/commit/f04a6e4a5d07b3229e255280245877bbd02717ab))
* compressed images in assets folder ([123b967](https://github.com/M-Facey/formjam/commit/123b96765c899c27b182f4981e952a4cdf788924))
* ensured questions data is not empty ([6287b5c](https://github.com/M-Facey/formjam/commit/6287b5c74ce0c598ea241ae385de710bd5f1cf37))
* fix spaces between text inside editor ([85ff23c](https://github.com/M-Facey/formjam/commit/85ff23ca8d5c9ef80a66cbee07a45ca13c2f28b8))
* increased wait time, removed console logs ([84c9d67](https://github.com/M-Facey/formjam/commit/84c9d67e41bed36c97b3ab024e6d58c0b0274a51))
* made colors adjustable ([4316e9a](https://github.com/M-Facey/formjam/commit/4316e9a48081443cbbbb031bf1b2c8bf5dd0e1a7))
* made dropdown smaller ([9fca65b](https://github.com/M-Facey/formjam/commit/9fca65b080a7bcaa6a0bf9b01e91755232e394a5))
* made editor menu animation faster ([0ac5e1e](https://github.com/M-Facey/formjam/commit/0ac5e1e6954af586922a1b90e3788b6fa555f55d))
* made validation error message consistent ([5b96082](https://github.com/M-Facey/formjam/commit/5b96082dfb23bafb3765cc3a626b8273acdcc744))
* organized form components ([12d2f3e](https://github.com/M-Facey/formjam/commit/12d2f3ef3ec84118b0e561070d8eb63e3bf9f22c))
* organized icons into folders ([0880627](https://github.com/M-Facey/formjam/commit/08806277e901516b17f4b9df37bc9a71ad2f6168))
* prevented alert icon from shrinking ([14698dc](https://github.com/M-Facey/formjam/commit/14698dcdb0ccb3574cadd22777b58e38563a9cba))
* reduced duration for error message timeout ([bf03ab5](https://github.com/M-Facey/formjam/commit/bf03ab5227c0a8007983934d2a942c667a4cf580))
* refactored dashboard related layouts and nav bars ([0e84631](https://github.com/M-Facey/formjam/commit/0e84631f52253dc0d23e0bc24172a4ea210ba8a3))
* removed boilerplate code ([ef942eb](https://github.com/M-Facey/formjam/commit/ef942ebafc476e81525e8f8089c72a7c6aad009e))
* removed create form button ([5abfeee](https://github.com/M-Facey/formjam/commit/5abfeee368b46f29602192c3403a9a5cb4de79a6))
* removed default stroke width ([9f77b8f](https://github.com/M-Facey/formjam/commit/9f77b8f1532cf1e4a0c617345b08e756199b5903))
* removed parallel jobs for action ([4a1e4d7](https://github.com/M-Facey/formjam/commit/4a1e4d757972471dae09a8ba8467b5877c8a8b80))
* removed unnecesaary mounted hook from auth ([1d207e3](https://github.com/M-Facey/formjam/commit/1d207e3227724e00ac46f8d8732653fcb7a01048))
* removed unnecessary component for auth route ([9710749](https://github.com/M-Facey/formjam/commit/9710749e674bd709070ce41f3ed7179a1e7dd7ff))
* renamed app layout to dashboard ([ba8bc5b](https://github.com/M-Facey/formjam/commit/ba8bc5b5e375f3c2def32e9a97f5f65b52767056))
* renamed inputs icons folder to input ([f7babc8](https://github.com/M-Facey/formjam/commit/f7babc80e3d83e41d91b3a487460597c96c02399))
* replaced common styles with container class ([bdd978b](https://github.com/M-Facey/formjam/commit/bdd978b56d08cb97497bba89c64eb98986ed2e39))
* replaced png images with webp images ([c9eea4f](https://github.com/M-Facey/formjam/commit/c9eea4f91bb5f537aa13168d10175ad2dac520bc))
* replaced ref with shallowRef ([6803176](https://github.com/M-Facey/formjam/commit/68031763b20c493d03dc5e133d7c56cdd5427316))
* replaced text-based emojis with icons ([4602faf](https://github.com/M-Facey/formjam/commit/4602fafa48572d57e1b56d7b02c013442ea4cdff))
* set heading font to epilogue ([8c79662](https://github.com/M-Facey/formjam/commit/8c7966230d8f1d441253975d06980593852cf94c))
* set width and height for temp app logo ([7fd708e](https://github.com/M-Facey/formjam/commit/7fd708eb99960490778a80da9454627363f814cc))
* updated answer type, fixed typo ([e36fec5](https://github.com/M-Facey/formjam/commit/e36fec538adeb6c16d93ea5b419d6c49105343a9))
* updated base collection & question type ([f92cbcb](https://github.com/M-Facey/formjam/commit/f92cbcb9cdd4c9a0027518f00d3492c66bda4f8e))
* updated create form functionality ([0170544](https://github.com/M-Facey/formjam/commit/01705442d92f8c3e6d864705b24aa37161904c0b))
* updated dropdown type ([b579861](https://github.com/M-Facey/formjam/commit/b579861b8695e7bfdbb3b64a0c5dcd770600aef3))
* updated import to @ alias ([cbe19de](https://github.com/M-Facey/formjam/commit/cbe19de0c48ae1c7b29ebbbd1e43866d52f52a39))
* updated question type defs ([d906a27](https://github.com/M-Facey/formjam/commit/d906a27a56fecc874ecc8b3d51d061872512f36a))
* updated styles for text input ([8db9ef9](https://github.com/M-Facey/formjam/commit/8db9ef9f8f2027a01df0c2b538aac53f5220720d))
* updated text and checkbox input types ([9aab5bc](https://github.com/M-Facey/formjam/commit/9aab5bc1301709a9edeaae74d3dd3cae44a7c924))
* updated toggle UI ([57d054e](https://github.com/M-Facey/formjam/commit/57d054e79093c095a5007e2025e45eaf71bcc4ee))
* used form store functions ([9dd3a7e](https://github.com/M-Facey/formjam/commit/9dd3a7ed8d293d00777ef612edf59075fe1b8c7e))
* used semantic elements in checkbox component ([51ad8d6](https://github.com/M-Facey/formjam/commit/51ad8d6a118f94ca5f502fae29b1bab3fd379e56))


### Documentation

* added banner & cypress badge ([986472b](https://github.com/M-Facey/formjam/commit/986472b91e286ed5f42871954c47fe0253e896ed))
* added basic description and commands ([e2367a1](https://github.com/M-Facey/formjam/commit/e2367a1bc7253a40645bf913009933ad2adf933b))
* added content for router readme ([4417cd5](https://github.com/M-Facey/formjam/commit/4417cd5da9d309216f019066250da56990269e72))
* added content to component readme ([ca38d7f](https://github.com/M-Facey/formjam/commit/ca38d7f8d0e46dd237af41f907ca8d19faf7ed2a))
* added envs to readme ([cb69324](https://github.com/M-Facey/formjam/commit/cb69324ac54472a6ee6e075100e523d681a2bb62))
* added link to form layout ([380e427](https://github.com/M-Facey/formjam/commit/380e427f6ed3c95dc0778abaf2a7f78cb756694f))
* added links and updated pocketbase version ([3e71ae8](https://github.com/M-Facey/formjam/commit/3e71ae8f667480df91580cbbe45a06d197ef864e))
* added src doc ([887e7b0](https://github.com/M-Facey/formjam/commit/887e7b05c22ff4cb37f2525fc436179acf116f45))
* created doc for router & component folder ([e020d95](https://github.com/M-Facey/formjam/commit/e020d954779496139a7317a0f396670d9b5284f6))
* fixed list for controls folder ([afbc9c2](https://github.com/M-Facey/formjam/commit/afbc9c2b63dde807b7fdcfdc95b43c8e0e0773be))
* fixed lists in icons readme ([5c122cb](https://github.com/M-Facey/formjam/commit/5c122cb6645c684f12a7e28ba6456ac276c8031d))
* fixed typo in router readme ([dd4869c](https://github.com/M-Facey/formjam/commit/dd4869cfb8593cad0c37cf264b9d9c5d97f2ce94))
* fixed verbiage on readme ([e5ab182](https://github.com/M-Facey/formjam/commit/e5ab1821e5195e142a7a564bbeca3a07dba827ca))
* removed separators ([249ddc5](https://github.com/M-Facey/formjam/commit/249ddc568feb9a89d4c828af00fc4637870656c1))
* updated readme with more tech and src doc ([921d7ef](https://github.com/M-Facey/formjam/commit/921d7eff198a9a866bc9fb683eb2002b069b63ab))
* updated tech used list ([ca68fa2](https://github.com/M-Facey/formjam/commit/ca68fa27292c5d01a0175711ab6f018aa3bc2a42))
