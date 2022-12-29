const path = require('path')
const fs = require('fs')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin')

const mode = process.env.NODE_ENV || 'development'
const devMode = mode === 'development'
const prodMode = !devMode
const target = devMode ? 'web' : 'browserslist'
const devtool = devMode ? 'source-map' : undefined

const PAGES_DIR = path.resolve(__dirname, 'src/pug/pages/')
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

const optimization = () => {
    const config = {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    }

    if (prodMode) {
        config.minimize = true
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin({
                terserOptions: {
                    format: {
                        comments: false
                    }
                },
                extractComments: false
            }),
            new ImageMinimizerWebpackPlugin({
                minimizer: [
                    {
                        implementation: ImageMinimizerWebpackPlugin.sharpMinify,
                        options: {
                            encodeOptions: {
                                jpeg: {
                                    quality: 100
                                },
                                webp: {
                                    lossless: true
                                },
                                avif: {
                                    lossless: true
                                },
                                png: {},
                                gif: {}
                            }
                        }
                    },
                    {
                        implementation: ImageMinimizerWebpackPlugin.svgoMinify,
                        options: {
                            encodeOptions: {
                                multipass: true,
                                plugins: [
                                    "preset-default"
                                ]
                            }
                        }
                    }
                ]
            })
        ]
    }

    return config
}

const filename = (path = '', hash = '', ext) => (devMode || hash == '') ? `${path}[name].${ext}` : `${path}[name].${hash}.${ext}`

module.exports = {
    mode,
    target,
    devtool,
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        parallax: ['@babel/polyfill', './scripts/modules/parallax.js'],
        index: './index.js'
    },
    output: {
        filename: filename('scripts/','[contenthash:8]', 'js'),
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        assetModuleFilename: 'assets/[name][ext]'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@sass': path.resolve(__dirname, 'src/sass'),
            '@scripts': path.resolve(__dirname, 'src/scripts'),
            '@modules': path.resolve(__dirname, 'src/scripts/modules'),
            '@actions': path.resolve(__dirname, 'src/scripts/actions'),
            '@img': path.resolve(__dirname, 'src/assets/img')
        }
    },
    optimization: optimization(),
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'src')
        },
        port: 9000,
        open: true,
        compress: true,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.pug$/i,
                loader: 'pug-loader',
                options: {
                    pretty: devMode
                }
            },
            {
                test: /\.(jpe?g|png|webp|gif|svg|ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: filename('[path]','[hash]','[ext]')
                }
            },
            {
                test: /\.(woff2?|ttf|eot|)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name][ext]'
                }
            },
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('postcss-preset-env'), require('postcss-css-variables')],
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.m?js$/i,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        ...PAGES.map(page => new HTMLWebpackPlugin({
            favicon: 'favicon.svg',
            template: `./pug/pages/${page}`,
            filename: `./${page.replace(/\.pug/, '.html')}`,
            inject: 'body',
            minify: {
                collapseWhitespace: prodMode
            }
        })),
        new MiniCssExtractPlugin({
            filename: filename('css/','[contenthash:8]', 'css')
        }),
        new FaviconsWebpackPlugin({
            logo: 'favicon.svg',
            mode: 'webapp',
            devMode: 'webapp',
            prefix: 'assets/favicons/',
            manifest: 'manifest.json',
            cache: true,
            favicons: {
                background: '#fff',
                theme_color: '#fff',
                start_url: '../../',
                appleStatusBarStyle: 'default',
                icons: {
                    'android': [
                        'android-chrome-144x144.png',
                        'android-chrome-192x192.png',
                        'android-chrome-256x256.png',
                        'android-chrome-36x36.png',
                        'android-chrome-384x384.png',
                        'android-chrome-48x48.png',
                        'android-chrome-512x512.png',
                        'android-chrome-72x72.png',
                        'android-chrome-96x96.png'
                    ],
                    'appleIcon': [
                        // 'apple-touch-icon-1024x1024.png',
                        // 'apple-touch-icon-114x114.png',
                        // 'apple-touch-icon-120x120.png',
                        // 'apple-touch-icon-144x144.png',
                        // 'apple-touch-icon-152x152.png',
                        // 'apple-touch-icon-167x167.png',
                        'apple-touch-icon-180x180.png',
                        // 'apple-touch-icon-57x57.png',
                        // // 'apple-touch-icon-60x60.png',
                        // // 'apple-touch-icon-72x72.png',
                        // // 'apple-touch-icon-76x76.png',
                        'apple-touch-icon-precomposed.png',
                        'apple-touch-icon.png'
                    ],
                    'appleStartup': false, //[
                    //     'apple-touch-startup-image-1125x2436.png',
                    //     'apple-touch-startup-image-1136x640.png',
                    //     'apple-touch-startup-image-1242x2208.png',
                    //     'apple-touch-startup-image-1242x2688.png',
                    //     'apple-touch-startup-image-1334x750.png',
                    //     'apple-touch-startup-image-1536x2048.png',
                    //     'apple-touch-startup-image-1620x2160.png',
                    //     'apple-touch-startup-image-1668x2224.png',
                    //     'apple-touch-startup-image-1668x2388.png',
                    //     'apple-touch-startup-image-1792x828.png',
                    //     'apple-touch-startup-image-2048x1536.png',
                    //     'apple-touch-startup-image-2048x2732.png',
                    //     'apple-touch-startup-image-2160x1620.png',
                    //     'apple-touch-startup-image-2208x1242.png',
                    //     'apple-touch-startup-image-2224x1668.png',
                    //     'apple-touch-startup-image-2388x1668.png',
                    //     'apple-touch-startup-image-2436x1125.png',
                    //     'apple-touch-startup-image-2688x1242.png',
                    //     'apple-touch-startup-image-2732x2048.png',
                    //     'apple-touch-startup-image-640x1136.png',
                    //     'apple-touch-startup-image-750x1334.png',
                    //     'apple-touch-startup-image-828x1792.png'
                    // ],
                    'favicons': [
                        'favicon-16x16.png',
                        'favicon-32x32.png',
                        'favicon-48x48.png',
                        'favicon.ico'
                    ],
                    'windows': false,//[
                    //     // 'mstile-144x144.png',
                    //     // 'mstile-150x150.png',
                    //     // 'mstile-310x150.png',
                    //     // 'mstile-310x310.png',
                    //     // 'mstile-70x70.png'
                    // ],
                    'yandex': false,//[
                    //     'yandex-browser-50x50.png'
                    // ]
                    coast: false,
                    firefox: false
                }
            }
        })
    ]
}