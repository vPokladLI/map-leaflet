const sharing = {
  config: {},
  init(config) {},

  addListeners() {
    document
      .querySelectorAll(".share-container a")
      .forEach((e) => e.addEventListener("click", sharing.handle));
  },
  replaceAll(string, search, replacement) {
    return string.split(search).join(replacement);
  },

  handle(event) {
    let currentNetwork = this.getAttribute("data-social");
    let leftPos = window.outerWidth / 2 - 300;
    let topPos = window.outerHeight / 2 - 150;
    event.preventDefault();

    if (currentNetwork === "facebook") {
      let text;
      if (!sharing.config.text) {
        sharing.getMetaDescription(currentNetwork);
        text = sharing.config.text || null;
      } else {
        text = sharing.config.text || null;
      }
      window.open(
        "https://www.facebook.com/sharer/sharer.php?u=" +
          encodeURI(window.location.origin + window.location.pathname) +
          "&t=" +
          encodeURIComponent(text),
        "",
        "menubar=no,toolbar=no,resizable=no,scrollbars=yes,height=300,width=600,top=" +
          topPos +
          ", left=" +
          leftPos
      );
      return false;
    } else if (currentNetwork === "twitter") {
      let text;
      if (!sharing.config.sharingTextTwitter) {
        sharing.getMetaDescription(currentNetwork);
        text = sharing.config.title;
      } else {
        if (sharing.config.sharingTextTwitter.indexOf("#") > -1) {
          text = sharing.replaceAll(
            sharing.config.sharingTextTwitter,
            "#",
            "%23"
          );
        } else {
          text = sharing.config.sharingTextTwitter;
        }
      }
      window.open(
        "https://twitter.com/share?url=" +
          encodeURI(window.location.origin + window.location.pathname) +
          "&text=" +
          encodeURIComponent(text),
        "",
        "menubar=no,toolbar=no,resizable=no,scrollbars=yes,height=300,width=600,top=" +
          topPos +
          ", left=" +
          leftPos
      );
      return false;
    } else if (currentNetwork === "whatsapp") {
      window.open(
        "https://wa.me/?text=" +
          encodeURI(window.location.origin + window.location.pathname),
        "",
        "menubar=no,toolbar=no,resizable=no,scrollbars=yes,height=700,width=650,top=" +
          (topPos - 200) +
          ", left=" +
          leftPos +
          ", mini=true"
      );
      return false;
    } else if (currentNetwork === "linkedin") {
      let text;
      let title;
      if (
        !sharing.config.sharingTitleLinkedin ||
        !sharing.config.sharingTextLinkedin
      ) {
        sharing.getMetaDescription(currentNetwork);
        text = sharing.config.text;
        title = sharing.config.title;
      } else {
        text = sharing.config.sharingTextLinkedin;
        title = sharing.config.sharingTitleLinkedin;
      }
      window.open(
        "https://www.linkedin.com/shareArticle?mini=true&url=" +
          encodeURI(window.location.origin + window.location.pathname) +
          "&title=" +
          title +
          "&summary=" +
          text,
        "",
        "menubar=no,toolbar=no,resizable=no,scrollbars=yes,height=300,width=600,top=" +
          topPos +
          ", left=" +
          leftPos +
          ", mini=true"
      );
    } else if (currentNetwork === "xing") {
      window.open(
        "https://www.xing-share.com/app/user?op=share;sc_p=xing-share;url=" +
          encodeURI(window.location.origin + window.location.pathname),
        "",
        "menubar=no,toolbar=no,resizable=no,scrollbars=yes,height=300,width=600,top=" +
          topPos +
          ", left=" +
          leftPos +
          ", mini=true"
      );
    }
  },

  getMetaDescription(network) {
    if (network === "facebook") {
      network = "og";
    }
    if (!sharing.config.text) {
      if (document.querySelector(`meta[name="${network}:description"]`)) {
        let metaContent = document.querySelector(
          `meta[name="${network}:description"]`
        ).content;
        sharing.config.text = metaContent;
      } else {
        console.error(`meta[name="${network}:description"] not found in DOM`);
      }
    }
    if (!sharing.config.title) {
      if (document.querySelector(`meta[name="${network}:title"]`)) {
        let metaContent = document.querySelector(
          `meta[name="${network}:title"]`
        ).content;
        sharing.config.title = metaContent;
      } else {
        console.error(`meta[name="${network}:title"]  not found in DOM`);
      }
    }
  },
};
document.addEventListener("DOMContentLoaded", sharing.addListeners);
