const jsonHero = "https://jsonhero.io/new?j="

const Base64 = {
    encode: function(s) {
      return btoa(unescape(encodeURIComponent(s)));
    },
    decode: function(s) {
      return decodeURIComponent(escape(atob(s)));
    }
  };

export class JsonViewer{
constructor(jsonStr){
        this.jsonStr = jsonStr
    }

    isValid(){
        try {
            JSON.parse(this.jsonStr);
        } catch (e) {
            return false;
        }
        return true;
    }

    buildRequest = () => {
        const encodeContent = Base64.encode(this.jsonStr)
        return jsonHero+encodeContent
    }

    

}