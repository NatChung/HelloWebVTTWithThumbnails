# HelloWebvttWithThumbnails
This is a practice project for drag and draw seek with preview 

### FastImage preload not work in Android
I using react native FastImage, it provided preload feature it works fine in iOS but Android. The problem is the image (<Fastimage/>) loading source not from cache.
### Add .diskCacheStrategy(DiskCacheStrategy.SOURCE)
###### in FastImageViewManager.java 
```java
Glide
    .with(view.getContext())
    .load(glideUrl)
    .priority(priority)
    .placeholder(TRANSPARENT_DRAWABLE)
    .listener(LISTENER)
    .diskCacheStrategy(DiskCacheStrategy.SOURCE)
    .into(view);
```
