package eu.zavadil.wn.imagez;

import java.io.FileInputStream;
import java.net.URL;

public interface ImagezSmartApi {

	ImageHealthPayload getHealth(String name);

	ImageHealthPayload upload(FileInputStream fileStream);

	ImageHealthPayload uploadFromUrl(String url);

	URL getImageUrlOriginal(String name);

	URL getImageUrlResized(String name, ResizeRequest resizeRequest);

}
