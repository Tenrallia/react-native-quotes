module.exports = function(api) {
  api.cache(true)

  return {                                                                                           
    presets: ["babel-preset-expo"],                                                                                                                             
    plugins: [                                                                                                                                                  
      [                                                                                                                                                         
        require.resolve("babel-plugin-module-resolver"),                                                                                                        
        {                                                                                                                                                
          root: ["./src/"],                                                                                                                              
          alias: {                                                                                                                                       
            assets: "assets",                                                                                                        
            screens: "screens",                                                                                                        
          },                                                                                                                                             
          extensions: [".js", ".jsx", ".tsx"],                                                                                        
        },                                                                                                                                                      
      ],                                                                                                                                                 
    ],        
  }
}
