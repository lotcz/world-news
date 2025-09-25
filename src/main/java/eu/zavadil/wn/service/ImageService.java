package eu.zavadil.wn.service;

import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.data.image.Image;
import eu.zavadil.wn.data.image.ImageRepository;
import eu.zavadil.wn.imagez.ImagezSmartApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ImageService {

	@Autowired
	ImageRepository imageRepository;

	@Autowired
	ImagezSmartApi imagez;

	@Transactional
	public Image save(Image image) {
		return this.imageRepository.save(image);
	}

	public Page<Image> search(String search, PageRequest pr) {
		return StringUtils.isBlank(search) ? this.imageRepository.findAll(pr)
			: this.imageRepository.search(search, pr);
	}

	public Image loadById(int id) {
		return this.imageRepository.findById(id).orElse(null);
	}

	public Image requireById(int id) {
		return this.imageRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Image", id));
	}

	public void deleteById(int id) {
		// todo: check if can be deleted

		Image image = this.requireById(id);
		this.imageRepository.delete(image);

		// todo: check if same name exists elsewhere
		// deleted successfully from db, delete file from imagez
		this.imagez.deleteOriginal(image.getName());
	}

}
